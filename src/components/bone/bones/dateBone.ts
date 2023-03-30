// @ts-nocheck
import {formatstring} from "../utils";
import {RawBone} from "./rawBone";
import type SlInput from "../../input/input";
import type {BoneStructure} from "../interfaces";
import type {BoneValue} from "./rawBone";
import type {TemplateResult} from "lit";

export class DateBone extends RawBone {

  view(formater: any = formatstring): string | TemplateResult<1> {

    function dateFormat(data: BoneValue, boneStructure: BoneStructure, lang: string | null = null) {
      const val = formatstring(data, boneStructure, lang).toString();
      const date = new Date(val);
      if (boneStructure["time"]) {
        return date.toLocaleDateString("de", {hour: '2-digit', minute: '2-digit', second: '2-digit'});
      }
      return date.toLocaleDateString("de");


    }

    return super.view(dateFormat);
  }

  getEditor(value: string, boneName: string, lang: string | null = null): HTMLElement {
    const dateBone: SlInput = super.getEditor(value, boneName, lang);

    if (this.boneStructure["time"]) {

      dateBone.type = "datetime-local"
      if(value!==null && value !==undefined)
      {
        dateBone.value = value.split('+')[0];
      }

    } else {
      dateBone.type = "date"
      if(value!==null && value !==undefined) {
        dateBone.value = (new Date(value)).toISOString().substr(0, 10);
      }
    }


    return dateBone;
  }

}
