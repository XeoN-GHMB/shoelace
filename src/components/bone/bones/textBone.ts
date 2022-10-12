import {RawBone} from "./rawBone";

export class TextBone extends RawBone {
  constructor(boneValue: any, boneName = "", boneStructure = {}, mainInstance = null) {
    super(boneValue, boneName, boneStructure, mainInstance);
  }


}
