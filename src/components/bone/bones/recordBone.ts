import {RawBone} from "./rawBone";

export class RecordBone extends RawBone{
  constructor(boneValue: any, boneName = "", boneStructure = {}) {
    super(boneValue,boneName,boneStructure);
  }

}
