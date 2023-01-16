// @ts-nocheck
import {RawBone} from "./rawBone";
import type SlInput from "../../input/input";
import {translate} from "../utils";

export class SpatialBone extends RawBone {


  getEditor(value: [number, number], boneName: string, lang: string | null = null): HTMLElement {
    const spatialWrapper = document.createElement("div");
    spatialWrapper.classList.add("spatial-wrapper");
    if (value === null) {
      value = ["", ""];
    }
    const lat = value[0];
    const lng = value[1];

    const latInput = document.createElement("sl-input")
    latInput.name = `${boneName}.lat`;
    if (this.boneStructure["readonly"] || this.mainInstance.disabled) {
      latInput.disabled = true;
    }
    latInput.value = lat.toString();
    latInput.type = "number";
    latInput.placeholder = translate("names.lat");
    latInput.classList.add("lat-input");

    latInput.min = this.boneStructure["boundsLat"][0];
    latInput.max = this.boneStructure["boundsLat"][1];
    latInput.step = "any";
    spatialWrapper.appendChild(latInput);

    const lngInput: SlInput = document.createElement("sl-input")
    lngInput.name = `${boneName}.lng`;
     if (this.boneStructure["readonly"] || this.mainInstance.disabled) {
      lngInput.disabled = true;
    }
    lngInput.value = lng.toString();
    lngInput.type = "number";
    lngInput.placeholder = translate("names.lng");;
    lngInput.classList.add("lng-input");
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
