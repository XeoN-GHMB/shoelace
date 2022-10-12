import {RawBone} from "./rawBone";

export class NumericBone extends RawBone {
  constructor(boneValue: any, boneName = "", boneStructure = {}, mainInstance = null) {
    super(boneValue, boneName, boneStructure, mainInstance);
  }

  getEditor(value, boneName:string): HTMLElement {
    const numericBone= super.getEditor(value, boneName);
    numericBone.type = "number";
    numericBone.min = this.boneStructure["min"];
    numericBone.max = this.boneStructure["max"];
    if (this.boneStructure["precision"] > 1) {
      numericBone.step = "0." + "0".repeat(this.boneStructure["precision"] - 1) + "1";
    }

    return numericBone;

  }

}
