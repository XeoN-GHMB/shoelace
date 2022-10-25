// @ts-nocheck
import { BoneValue, RawBone} from "./rawBone";
import {formatstring} from "../utils";
import {TemplateResult} from "lit";
import SlInput from "../../input/input";
import {BoneStructure} from "../interfaces";

export class DateBone extends RawBone {

  view(formater: any = formatstring): string | TemplateResult<1> {

    function dateFormat(data:BoneValue, boneStructure: BoneStructure, lang = null) {
      const val = formatstring(data, boneStructure, lang).toString();
      const date = new Date(val);
      if (boneStructure["time"]) {
        return date.toLocaleDateString("de",{hour: '2-digit', minute:'2-digit',second:'2-digit'});
      } else {
        return date.toLocaleDateString("de");
      }

    }

    return super.view(dateFormat);
  }

  getEditor(value:string, boneName: string,lang:any=null): HTMLElement {
    const dateBone:SlInput = super.getEditor(value, boneName,lang);

    if (this.boneStructure["time"]) {

      dateBone.type = "datetime-local"
      dateBone.value = value.split('+')[0]
    } else {
      dateBone.type = "date"
      dateBone.value = (new Date(value)).toISOString().substr(0, 10);
    }


    return dateBone;
  }

}
