import {RawBone} from "./rawBone";
import SlButton from "../../button/button";
import SlIcon from "../../icon/icon";
import {BoneEditRenderer} from "../boneEditRenderer";

export class RecordBone extends RawBone{
   constructor(boneValue: any, boneName = "", boneStructure = {}, mainInstance = null) {
    super(boneValue,boneName,boneStructure,mainInstance);
  }
  getEditor(value:any, boneName:string): HTMLElement {
    const recordboneWrapper = document.createElement("div");
    recordboneWrapper.classList.add("record-wrapper");

    recordboneWrapper.dataset.boneName = boneName;
    recordboneWrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    recordboneWrapper.dataset.depth = this.depth.toString();


    for (const [_boneName, _boneStructure] of Object.entries(this.boneStructure["using"])) {

      let recordBoneValue: any = null;
      if (value !== null) {
        recordBoneValue = value[_boneName];

      }
      const newBoneName = boneName + "." + _boneName;
      const tmp_renderer = new BoneEditRenderer(newBoneName, recordBoneValue,_boneStructure , this.mainInstance).getBone();
      const tmp: HTMLElement = new tmp_renderer(newBoneName, recordBoneValue,_boneStructure , this.mainInstance).edit(true, this.depth + 1);
      tmp.dataset.fromRecord = "true";

      recordboneWrapper.appendChild(tmp);
    }

    recordboneWrapper.addEventListener("submit", (e) => {

      e.preventDefault()
    })
    return recordboneWrapper;
  }

}
