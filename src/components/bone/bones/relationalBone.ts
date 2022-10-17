import {RawBone} from "./rawBone";
import SlCombobox from "../../combobox/combobox";
import SlIconButton from "../../icon-button/icon-button";
import {apiurl, formatstring} from "../utils";

export class RelationalBone extends RawBone {


  getEditor(value: any, boneName: string): HTMLElement {
    //return this.getSearchbar(value, boneName);
    return this.getSelect(value, boneName);
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

    const clearButton: SlIconButton = document.createElement("sl-icon-button")
    clearButton.library = "my-icons";
    clearButton.slot = "suffix";
    clearButton.name = "x-circle";
    clearButton.id = "clearButton"
    searchBox.appendChild(clearButton);

    searchBox.hoist = true;
    if (value !== null && value !== "") {
      console.log("form", formatstring(this.mainInstance.relationalCache[value], this.boneStructure, null, true));
      searchBox.placeholder = formatstring(this.mainInstance.relationalCache[value], this.boneStructure, null, true);
    }

    const url = `${apiurl}/json/${this.boneStructure["module"]}/list?search={q}`;


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
      await fetch(`${apiurl}/json/${this.boneStructure["module"]}/view/${e.detail.item.value}`)
        .then(response => response.json())
        .then((data) => {
          this.mainInstance.relationalCache[e.detail.item.value] = {dest: data["values"]}
        });

      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
      //this.mainInstance.internboneValue[this.boneName] = {dest: JSON.parse(e.detail.item.value)}
      //this.mainInstance.handleChange(formData);

    });

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

    const inputWrapper = document.createElement("div");
    const shadowInput = document.createElement("sl-input");
    const showInput = document.createElement("sl-input");
    const selectButton = document.createElement("sl-button");


    const url = `${apiurl}/json/${this.boneStructure["module"]}/list?search={q}`;


    //Shadow input
    shadowInput.hidden = true;
    shadowInput.name = boneName;
    shadowInput.value = value;

    showInput.disabled=true;

    //selectButton
    selectButton.innerText = "Select";
    selectButton.addEventListener("click", () => {
      console.log("open")
      this.getDialog(inputWrapper,shadowInput,showInput);
    })


    inputWrapper.dataset.name = "relational-" + boneName;
    inputWrapper.appendChild(shadowInput);
    inputWrapper.appendChild(showInput);
    inputWrapper.appendChild(selectButton);


    return inputWrapper;
  }

  getDialog(inputWrapper,shadowInput,showInput) {//Todo store tables
    const dialog = document.createElement("sl-dialog");
    dialog.open = true;
    dialog.label = "Select";

    const table = document.createElement("sl-table");
    table.rowselect = true;
    table.height = "300px";
    table.rowindexes = true;
    fetch(`${apiurl}/json/${this.boneStructure["module"]}/list`).then(resp => resp.json().then((respdata) => {

      let structure: any = {}
      for (const item of respdata["structure"]) {

        structure[item[0]] = item[1]
      }

      table.structure = structure;
      table.skellist = respdata["skellist"];
      table.dataCursor = respdata["cursor"];

    }))
    table.addEventListener("table-fetchData", () => {
      fetch(`${apiurl}/json/${this.boneStructure["module"]}/list?cursor=${table.dataCursor}`).then(resp => resp.json().then((respdata) => {
        table.tableReady = true;
        table.addData(respdata["skellist"]);
        table.dataCursor = respdata["cursor"];

      }));

    })
    //footer
    const selectButton = document.createElement("sl-button");
    selectButton.slot = "footer";
    selectButton.textContent = "Select";
    selectButton.variant = "success";
    selectButton.addEventListener("click", () => { // todo multiple ?
      if (table.getSelectedRows().length>0)
      {
        const rowData = table.getSelectedRows()[0].getData();
        shadowInput.value=rowData["key"];
        showInput.value=formatstring({"dest": rowData}, this.boneStructure);
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      }


      dialog.hide();
    });
    dialog.appendChild(selectButton)


    const closeButton = document.createElement("sl-button");
    closeButton.slot = "footer";
    closeButton.textContent = "Close";
    closeButton.variant = "danger";
    closeButton.addEventListener("click", () => {
      dialog.hide();
      dialog.remove();
    });
    dialog.appendChild(closeButton)

    dialog.appendChild(table);

    document.body.appendChild(dialog);
  }

}
