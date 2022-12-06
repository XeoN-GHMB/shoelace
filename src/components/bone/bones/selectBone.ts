// @ts-nocheck
import {RawBone} from "./rawBone";
import type SlSelect from "../../select/select";

export class SelectBone extends RawBone {


  view() {
    if (this.boneStructure["languages"] !== null) {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {
          if (!Array.isArray(this.boneValue[lang])) {
            this.boneValue[lang] = [this.boneValue[lang]];
          }
          for (const i in this.boneValue[lang]) {
            this.boneStructure["values"].forEach((value: any) => {
              if (this.boneValue[lang][i] === value[0]) {
                this.boneValue[lang][i] = value[1];
              }
            })
          }
        }

      } else {
        for (const lang of this.boneStructure["languages"]) {
          this.boneStructure["values"].forEach((value: any) => {
            if (this.boneValue[lang] === value[0]) {
              this.boneValue[lang] = value[1];
            }
          })
        }
      }
    } else {
      if (this.boneStructure["multiple"]) {
        if (!Array.isArray(this.boneValue)) {
          this.boneValue = [this.boneValue];
        }
        for (const i in this.boneValue) {
          this.boneStructure["values"].forEach((value: any) => {

            if (this.boneValue[i] === value[0]) {
              this.boneValue[i] = value[1];
            }
          })
        }


      } else {

        this.boneStructure["values"].forEach((value: any) => {

          if (this.boneValue === value[0]) {

            this.boneValue = value[1];

          }
        })
      }
    }
    return super.view();
  }

  getEditor(value: any, boneName: string, lang: string | null = null): HTMLElement {
    const inputSelect: SlSelect = document.createElement("sl-select");

    inputSelect.name = boneName;
    if (value !== null && value !== undefined) {
      inputSelect.value = value;
    }

    inputSelect.dataset.boneName = boneName;
    if (this.boneStructure["readonly"] || this.mainInstance.disabled) {
      inputSelect.disabled = true;
    }
    //inputSelect.hoist = true; //Todo styling

    inputSelect.multiple = this.boneStructure["multiple"];
    for (const option of this.boneStructure["values"]) {
      const optionElement = document.createElement("sl-menu-item");
      optionElement.value = option[0];
      optionElement.innerText = option[1];
      inputSelect.appendChild(optionElement);

    }
    inputSelect.addEventListener("sl-change", (event) => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
      //this.mainInstance.boneValue = obj[this.mainInstance.boneName];

    });

    return inputSelect;
  }


}
