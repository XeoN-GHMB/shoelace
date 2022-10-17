import {BoneStructure, RawBone} from "./rawBone";
import {formatstring, translate} from "../utils";
import {html, TemplateResult} from "lit";

export class DateBone extends RawBone {

  view(formater: any = formatstring): string | TemplateResult<1> {

    function dateFormat(data, boneStructure: BoneStructure, lang = null) {
      let val = formatstring(data, boneStructure, lang);
      const date = new Date(val);
      if (boneStructure["time"]) {
        return date.toLocaleDateString("de",{hour: '2-digit', minute:'2-digit',second:'2-digit'});
      } else {
        return date.toLocaleDateString("de");
      }

    }

    return super.view(dateFormat);
  }

  getEditor(value, boneName: string,lang:any=null): HTMLElement {
    const dateBone = super.getEditor(value, boneName,lang);

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
