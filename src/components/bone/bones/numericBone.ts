import {RawBone} from "./rawBone";

export class NumericBone extends RawBone{
  constructor(boneValue: any, boneName = "", boneStructure = {}) {
    super(boneValue,boneName,boneStructure);
  }

}
