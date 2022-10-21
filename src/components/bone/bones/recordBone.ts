import {RawBone} from "./rawBone";
import {BoneEditRenderer} from "../boneEditRenderer";


export class RecordBone extends RawBone{

  getEditor(value:any, boneName:string,lang:any=null): HTMLElement {
     console.log("start record")
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
      const bone:object = new BoneEditRenderer(newBoneName, recordBoneValue,_boneStructure , this.mainInstance).getBone();
      const tmp: HTMLElement = new bone(newBoneName, recordBoneValue,_boneStructure , this.mainInstance).edit(true, this.depth + 1);
      tmp.dataset.fromRecord = "true";

      recordboneWrapper.appendChild(tmp);
    }

    recordboneWrapper.addEventListener("submit", (e) => {

      e.preventDefault()
    })
    return recordboneWrapper;
  }

}
