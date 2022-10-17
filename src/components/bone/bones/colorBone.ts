import {RawBone} from "./rawBone";
import SlColorPicker from "../../color-picker/color-picker";

export class ColorBone extends RawBone {
  //Todo how to show ?
  getEditor(value: any, boneName: string, lang: any = null): HTMLElement {
    const inputElement: SlColorPicker = document.createElement("sl-color-picker");
    //Todo this write always ??
    inputElement.addEventListener("sl-change", (change_event) => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });
    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    inputElement.value = value;


    return inputElement;
  }

}
