import {RawBone} from "./rawBone";
import SlCombobox from "../../combobox/combobox";
import SlIconButton from "../../icon-button/icon-button";
import {apiurl, formatstring} from "../utils";

export class RelationalBone extends RawBone {
  constructor(boneValue: any, boneName = "", boneStructure = {}, mainInstance = null) {
    super(boneValue, boneName, boneStructure, mainInstance);
  }

  getEditor(value:any, boneName:string): HTMLElement {
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
      console.log("form",formatstring(this.mainInstance.relationalCache[value] , this.boneStructure,null,true));
      searchBox.placeholder = formatstring(this.mainInstance.relationalCache[value] , this.boneStructure,null,true);
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

}
