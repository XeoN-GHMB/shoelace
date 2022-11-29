// @ts-nocheck
import {RawBone} from "./rawBone";
import type SlSwitch from "../../switch/switch";

export class BooleanBone extends RawBone {


  getEditor(value: boolean, boneName: string, lang: string | null = null): HTMLElement {
    const inputElement: SlSwitch = document.createElement("sl-switch");

    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    inputElement.addEventListener("sl-change", () => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });
    if (value !== null && value !== undefined) {
      inputElement.checked = value;
    }


    return inputElement;
  }

}
