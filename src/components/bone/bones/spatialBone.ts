import {RawBone} from "./rawBone";

export class SpatialBone extends RawBone{
  constructor(boneValue: any, boneName = "", boneStructure = {}) {
    super(boneValue,boneName,boneStructure);
  }

}
