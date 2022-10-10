import {RawBone} from "./rawBone";

export class StringBone extends RawBone{
  constructor(boneValue: any, boneName = "", boneStructure = {}) {
    super(boneValue,boneName,boneStructure);
  }

}
