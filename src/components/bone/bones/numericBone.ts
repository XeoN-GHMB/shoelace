// @ts-nocheck
import {RawBone} from "./rawBone";
import type SlInput from "../../input/input";

export class NumericBone extends RawBone {


  getEditor(value: number, boneName: string, lang: string | null = null): HTMLElement {
    const numericBone: SlInput = super.getEditor(value, boneName);
    numericBone.type = "number";
    numericBone.min = this.boneStructure["min"];
    numericBone.max = this.boneStructure["max"];
    if (this.boneStructure["precision"] > 1) {
      numericBone.step = parseFloat(`0.${"0".repeat(this.boneStructure["precision"] - 1)}1`);
    }

    return numericBone;

  }

}
