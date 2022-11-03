// @ts-nocheck
import {RawBone} from "./rawBone";
import type SlSwitch from "../../switch/switch";

export class BooleanBone extends RawBone {


  getEditor(value: boolean, boneName: string, lang: string | null = null): HTMLElement {
    const inputElement: SlSwitch = document.createElement("sl-switch");
    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    if (value !== null && value !== undefined) {
      inputElement.checked = value;
    }


    return inputElement;
  }

}
