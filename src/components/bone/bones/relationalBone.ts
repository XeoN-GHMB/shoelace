// @ts-nocheck
import {createPath, formatstring, getPath, translate} from "../utils";
import {RawBone} from "./rawBone";
import type SlCombobox from "../../combobox/combobox";
import type SlIconButton from "../../icon-button/icon-button";
import type SlTable from "../../table/table";
import type {BoneStructure} from "../interfaces";
import {SkelValues} from "../interfaces";
import fa from "../../../translations/fa";
import SlInput from "../../input/input";
import {BoneEditRenderer} from "../boneEditRenderer";

export class RelationalBone extends RawBone {

  lang: string;

  getEditor(value: any, boneName: string, lang: string | null = null): HTMLElement {
    //return this.getSearchbar(value, boneName);
    this.lang = lang;
    if (this.mainInstance.inVi) {
      return this.getSelect(value, boneName);
    }
    if (this.boneStructure["params"]["widget"] === "search") //TODO Better name ?
    {
      return this.getSearchbar(value, boneName);
    } else {
      return this.getSelect(value, boneName);
    }


  }

  getSearchbar(value: any, boneName: string): HTMLElement {
    /**
     * value can be :
     * null if a empty bone is renderd (multiple add)
     * key if we are in a add an we extend a multiple value
     * {dest:{name:"bla",key:"blablakey"}}
     *
     **/
    if (typeof (value) === "object" && value !== null) {
      if ("dest" in value) {
        const key = value["dest"]["key"]
        this.mainInstance.relationalCache[key] = value;
        value = key;
      }
    }

    const inputWrapper = document.createElement("div");
    const shadowInput = document.createElement("sl-input")
    const searchBox: SlCombobox = document.createElement("sl-combobox");

    inputWrapper.dataset.boneName = boneName;

    const clearButton: SlIconButton = document.createElement("sl-icon-button")
    clearButton.library = "my-icons";
    clearButton.slot = "suffix";
    clearButton.name = "x-circle";
    clearButton.id = "clearButton"
    searchBox.appendChild(clearButton);

    searchBox.hoist = true;
    if (value !== null && value !== "") {

      searchBox.placeholder = formatstring(this.mainInstance.relationalCache[value], this.boneStructure, null, true);
    }

    const url = `${this.mainInstance.apiUrl}/${this.mainInstance.getRenderer()}/${this.boneStructure["module"]}/list?search={q}`;


    //searchBox.style.width = "100%";
    //searchBox.style.boxSizing = "border-box";
    searchBox.dataset.boneName = boneName;
    searchBox.name = boneName;

    //Shadow input
    shadowInput.hidden = true;
    shadowInput.name = boneName;
    shadowInput.value = value;


    searchBox.source = (search: string) => {
      return fetch(url.replace('{q}', search))
        .then(res => res.json())
        .then((data) => {

            const skellist = data["skellist"]
            return skellist.map((d: any) => {
              return {
                text: formatstring({dest: d}, this.boneStructure),
                value: d.key
              };

            })
          }
        );
    };
    inputWrapper.appendChild(shadowInput);
    inputWrapper.appendChild(searchBox);

    searchBox.addEventListener("sl-item-select", async (e: CustomEvent) => {
      shadowInput.value = e.detail.item.value;
      await fetch(`${this.mainInstance.apiUrl}/${this.mainInstance.getRenderer()}/${this.boneStructure["module"]}/view/${e.detail.item.value}`)
        .then(response => response.json())
        .then((data) => {
          this.mainInstance.relationalCache[e.detail.item.value] = {dest: data["values"]}
        });

      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
      //this.mainInstance.internboneValue[this.boneName] = {dest: JSON.parse(e.detail.item.value)}
      //this.mainInstance.handleChange(formData);

    });
    if (this.boneStructure["readonly"]) {
      searchBox.disabled = true;
    }

    return inputWrapper;
  }

  getSelect(value: any, boneName: string): HTMLElement {
    /**
     * value can be :
     * null if a empty bone is renderd (multiple add)
     * key if we are in a add an we extend a multiple value
     * {dest:{name:"bla",key:"blablakey"}}
     *
     **/
    if (typeof (value) === "object" && value !== null) {
      if ("dest" in value) {
        const key = value["dest"]["key"]
        this.mainInstance.relationalCache[key] = value;
        value = key;
      }
    }
    const hasUsing = this.boneStructure["using"]!==null;

    const inputWrapper = document.createElement("div");
    const shadowInput = document.createElement("sl-input");
    const showInput = document.createElement("sl-input");
    const selectButton = document.createElement("sl-button");
    const selectIcon = document.createElement("sl-icon");

    showInput.dataset.boneName = `showinput-${boneName}`;
    console.log(showInput.dataset.boneName)
    inputWrapper.classList.add("relBone-wrap");
    inputWrapper.dataset.boneName = boneName;

    //Shadow input
    shadowInput.hidden = true;
    if(hasUsing)
    {
       shadowInput.name = `${boneName}.key`;
    }
    else
    {
        shadowInput.name = boneName;
    }
    shadowInput.dataset.boneName = `shoadowinput-${boneName}`;
    shadowInput.value = value;

    showInput.disabled = true;
    if (this.mainInstance.relationalCache[value] !== undefined) {
      if (this.boneStructure["format"]) {
        showInput.placeholder = formatstring(this.mainInstance.relationalCache[value], this.boneStructure, null, true);
      } else {
        showInput.placeholder = value;
      }
    }


    //selectButton
    selectButton.title = translate("actions.select");
    selectIcon.setAttribute("name", "plus")
    selectButton.appendChild(selectIcon);
    selectButton.setAttribute("variant", "success")
    selectButton.setAttribute("outline", "")
    selectButton.classList.add("add-button")
    selectButton.addEventListener("click", () => {
      if (this.mainInstance.inVi) {
        this.mainInstance.openVISelect(boneName);
      } else {
        this.getDialog(inputWrapper, shadowInput, showInput);
      }


    })
    /*
    const testbtn = document.createElement("sl-button")
    testbtn.title = "test me"
    testbtn.textContent = "test me"
    testbtn.addEventListener("click", () => {
      const self = this;
      fetch(`${this.mainInstance.apiUrl}/${this.mainInstance.getRenderer()}/${this.boneStructure["module"]}/list?limit=5`).then(resp => resp.json().then((respdata) => {
        self.addRelation(respdata["skellist"], boneName);
      }));

    })
    inputWrapper.appendChild(testbtn);*/


    inputWrapper.dataset.name = `relational-${boneName}`;
    inputWrapper.appendChild(shadowInput);
    inputWrapper.appendChild(showInput);
    if (!this.boneStructure["readonly"]) {
      inputWrapper.appendChild(selectButton);
    }

    // Check for using
    if(hasUsing)
    {
      const outerWrapper = document.createElement("div");
      outerWrapper.classList.add("bone-inner-wrap");

      const usingWrapper = document.createElement("div");
      usingWrapper.classList.add("record-wrapper");

      usingWrapper.dataset.boneName = boneName;
      usingWrapper.dataset.multiple = this.boneStructure["multiple"].toString();
      usingWrapper.dataset.depth = this.depth.toString();
      let relValue = null;
      if(this.mainInstance.relationalCache[value]!==undefined && this.mainInstance.relationalCache[value]!==null)
      {
         relValue = this.mainInstance.relationalCache[value]["rel"];
      }


      for (const [_boneName, _boneStructure] of Object.entries(this.boneStructure["using"])) {

        let recordBoneValue: any = null;
        if (relValue !== null && relValue !== undefined) {

          recordBoneValue = relValue[_boneName];

        }
        const newBoneName = `${boneName}.${_boneName}`;
        _boneStructure["readonly"] = this.boneStructure["readonly"]//override readonly that all child bones are readonly too
        const bone: object = new BoneEditRenderer(newBoneName, recordBoneValue, _boneStructure, this.mainInstance).getBone();
        const tmp: HTMLElement = new bone(newBoneName, recordBoneValue, _boneStructure, this.mainInstance).edit(true, this.depth + 1);
        tmp.dataset.fromRecord = "true";

        usingWrapper.appendChild(tmp);
      }
      outerWrapper.appendChild(inputWrapper);
      outerWrapper.appendChild(usingWrapper);
      return outerWrapper;
    }


    return inputWrapper;
  }

  getDialog(inputWrapper, shadowInput, showInput) {//Todo store tables
    const dialog = document.createElement("sl-dialog");
    dialog.open = true;
    dialog.label = "Select";

    const table: SlTable = document.createElement("sl-table");
    if (this.boneStructure.multiple) {
      table.rowselect = true;
    } else {
      table.rowselect = 1;
    }

    table.height = "300px"; // todo auto  height ?
    table.rowindexes = true;
    fetch(`${this.mainInstance.apiUrl}/${this.mainInstance.getRenderer()}/${this.boneStructure["module"]}/list`).then(resp => resp.json().then((respdata) => {

      const structure: BoneStructure = {}
      for (const item of respdata["structure"]) {

        structure[item[0]] = item[1]
      }

      table.structure = structure;
      table.skellist = respdata["skellist"];
      table.dataCursor = respdata["cursor"];

    }))
    table.addEventListener("table-fetchData", () => {
      fetch(`${this.mainInstance.apiUrl}/${this.mainInstance.getRenderer()}/${this.boneStructure["module"]}/list?cursor=${table.dataCursor}`).then(resp => resp.json().then((respdata) => {
        table.tableReady = true;
        table.addData(respdata["skellist"]);
        table.dataCursor = respdata["cursor"];

      }));

    })
    //footer
    const selectButton = document.createElement("sl-button");
    selectButton.slot = "footer";
    selectButton.innerText = translate("actions.select");

    selectButton.variant = "success";
    selectButton.addEventListener("click", () => { // todo multiple ?


      if (table.getSelectedRows().length === 1) {

        const rowData = table.getSelectedRows()[0].getData();
        shadowInput.value = rowData["key"];
        if (this.boneStructure["format"]) {
          showInput.placeholder = formatstring({"dest": rowData}, this.boneStructure);
        } else {
          showInput.placeholder = rowData["key"]

        }


        this.mainInstance.internboneValue = this.reWriteBoneValue();
        this.mainInstance.handleChange();

      } else if (table.getSelectedRows().length > 1) {
        const path = this.lang === null ? this.boneName : `${this.boneName}.${this.lang}`;

        const rowData = table.getSelectedRows()[0].getData();
        shadowInput.value = rowData["key"];
        this.mainInstance.relationalCache[rowData["key"]] = {dest: rowData};

        let boneValues = this.reWriteBoneValue();
        boneValues = getPath(boneValues, path);
        console.log("boneValues", boneValues)
        for (const index in table.getSelectedRows()) {
          if (parseInt(index) === 0)//skip the firstElement
          {
            continue;
          }
          const entry = table.getSelectedRows()[index];
          const key = entry.getData()["key"];
          this.mainInstance.relationalCache[key] = {dest: entry.getData()};
          boneValues.push(key);
        }

        const obj = {}
        createPath(obj, path, boneValues)


        const multipleWrapper: HTMLElement = this.mainInstance.bone.querySelector(`[data-multiplebone="${path}"]`);


        if (multipleWrapper !== null) {
          const [element, index] = this.createMultipleWrapper(getPath(obj, path), this.lang);
          multipleWrapper.replaceWith(element);
          this.mainInstance.internboneValue = this.reWriteBoneValue();
          this.mainInstance.handleChange();
        }
      }


      dialog.hide();
    });
    dialog.appendChild(selectButton);


    const closeButton = document.createElement("sl-button");
    closeButton.slot = "footer";
    closeButton.textContent = translate("actions.close");
    closeButton.variant = "danger";
    closeButton.addEventListener("click", () => {
      dialog.hide();
      dialog.remove();
    });
    dialog.appendChild(closeButton)

    dialog.appendChild(table);

    document.body.appendChild(dialog);
  }

  addRelation(skel: Array<SkelValues> | SkelValues, boneName: string) {
    const shadowInput: SlInput = this.mainInstance.bone.querySelector(`[data-bone-name='shoadowinput-${boneName}']`);
    const showInput: SlInput = this.mainInstance.bone.querySelector(`[data-bone-name='showinput-${boneName}']`);
    if (Array.isArray(skel)) {
      const path = this.lang === null ? this.boneName : `${this.boneName}.${this.lang}`;

      const skeldata = skel[0];
      shadowInput.value = skeldata["key"];
      this.mainInstance.relationalCache[skeldata["key"]] = {dest: skeldata};

      let boneValues = this.reWriteBoneValue();
      boneValues = getPath(boneValues, path);
      for (const index in skel) {
        if (parseInt(index) === 0)//skip the firstElement
        {
          continue;
        }

        const entry = skel[index];
        const key = entry["key"];
        this.mainInstance.relationalCache[key] = {dest: entry};
        boneValues.push(key);
      }
      const obj = {}
      createPath(obj, path, boneValues)


      const multipleWrapper: HTMLElement = this.mainInstance.bone.querySelector(`[data-multiplebone="${path}"]`);


      if (multipleWrapper !== null) {
        const [element, index] = this.createMultipleWrapper(getPath(obj, path), this.lang);
        multipleWrapper.replaceWith(element);
        this.mainInstance.internboneValue = this.reWriteBoneValue();
        this.mainInstance.handleChange();
      }
    } else {

      shadowInput.value = skel["key"];
      if (this.boneStructure["format"]) {
        showInput.placeholder = formatstring({"dest": skel}, this.boneStructure);
      } else {
        showInput.placeholder = skel["key"]

      }


      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    }
  }

}
