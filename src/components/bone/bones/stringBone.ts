import {RawBone} from "./rawBone";

export class StringBone extends RawBone{
  constructor(boneValue: any, boneName = "", boneStructure = {}, mainInstance = null) {
    super(boneValue,boneName,boneStructure,mainInstance);
  }
}
