// @ts-nocheck
import {RawBone} from "./rawBone";
import type SlColorPicker from "../../color-picker/color-picker";

export class ColorBone extends RawBone {
  //Todo how to show ?
  getEditor(value: string, boneName: string, lang: string | null = null): HTMLElement {
    const inputElement: SlColorPicker = document.createElement("sl-color-picker");
    console.log(inputElement)
    //Todo this write always ??
    inputElement.addEventListener("sl-change", () => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });
    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    if (this.boneStructure["readonly"] || this.mainInstance.disabled) {
      inputElement.disabled = true;
    }
    if (value === null || value === undefined) {
      inputElement.value = this.boneStructure["emptyvalue"];
    } else {
      inputElement.value = value;
    }
    inputElement.classList.add("color-bone");

    return inputElement;
  }

}
