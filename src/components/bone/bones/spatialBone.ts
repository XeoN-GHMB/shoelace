import {RawBone} from "./rawBone";
import {BoneEditRenderer} from "../boneEditRenderer";

export class SpatialBone extends RawBone {


  getEditor(value: any, boneName: string,lang:any=null): HTMLElement {
    const spatialWrapper = document.createElement("div");
    const lat = value[0];
    const lng = value[1];

    const latInput = document.createElement("sl-input")
    latInput.name = boneName + ".lat";
    latInput.value = lat;
    latInput.type = "number";

    latInput.min = this.boneStructure["boundsLat"][0];
    latInput.max = this.boneStructure["boundsLat"][1];
    latInput.step = "any";
    spatialWrapper.appendChild(latInput);

    const lngInput = document.createElement("sl-input")
    lngInput.name = boneName + ".lng";
    lngInput.value = lng;
    lngInput.type = "number";
    lngInput.min = this.boneStructure["boundsLng"][0];
    lngInput.max = this.boneStructure["boundsLng"][1];
    lngInput.step = "any";
    spatialWrapper.appendChild(lngInput);

    latInput.addEventListener("sl-change", (change_event) => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });
    lngInput.addEventListener("sl-change", (change_event) => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });


    return spatialWrapper;
  }
}
