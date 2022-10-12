import {RawBone} from "./rawBone";
import SlSwitch from "../../switch/switch";

export class BooleanBone extends RawBone {
  constructor(boneValue: any, boneName = "", boneStructure = {}, mainInstance = null) {
    super(boneValue, boneName, boneStructure, mainInstance);
  }

  getEditor(value, boneName,lang): HTMLElement {
    const inputElement:SlSwitch = document.createElement("sl-switch");
    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    if(value!==null && value!==undefined) {
      inputElement.checked = value;
    }


    return inputElement;
  }

}
