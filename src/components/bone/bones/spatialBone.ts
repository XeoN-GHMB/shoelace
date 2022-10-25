// @ts-nocheck
import {RawBone} from "./rawBone";
import SlInput from "../../input/input";

export class SpatialBone extends RawBone {


  getEditor(value: [number,number], boneName: string,lang:any=null): HTMLElement {
    const spatialWrapper = document.createElement("div");
    if(value===null)
    {
      value=["",""];
    }
    const lat = value[0];
    const lng = value[1];

    const latInput = document.createElement("sl-input")
    latInput.name = boneName + ".lat";
    latInput.value = lat.toString();
    latInput.type = "number";

    latInput.min = this.boneStructure["boundsLat"][0];
    latInput.max = this.boneStructure["boundsLat"][1];
    latInput.step = "any";
    spatialWrapper.appendChild(latInput);

    const lngInput:SlInput = document.createElement("sl-input")
    lngInput.name = boneName + ".lng";
    lngInput.value = lng.toString();
    lngInput.type = "number";
    lngInput.min = this.boneStructure["boundsLng"][0];
    lngInput.max = this.boneStructure["boundsLng"][1];
    lngInput.step = "any";
    spatialWrapper.appendChild(lngInput);
    latInput.addEventListener("sl-change", () => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });
    lngInput.addEventListener("sl-change", () => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });


    return spatialWrapper;
  }
}
