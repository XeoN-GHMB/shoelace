import {RawBone} from "./rawBone";

export class DateBone extends RawBone{
  constructor(boneValue: any, boneName = "", boneStructure = {}) {
    super(boneValue,boneName,boneStructure);
  }

}
