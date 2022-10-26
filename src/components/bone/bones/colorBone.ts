// @ts-nocheck
import {RawBone} from "./rawBone";
import SlColorPicker from "../../color-picker/color-picker";

export class ColorBone extends RawBone {
  //Todo how to show ?
  getEditor(value: string, boneName: string, lang: string|null = null): HTMLElement {
    const inputElement: SlColorPicker = document.createElement("sl-color-picker");
    //Todo this write always ??
    inputElement.addEventListener("sl-change", () => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });
    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    inputElement.value = value;


    return inputElement;
  }

}
