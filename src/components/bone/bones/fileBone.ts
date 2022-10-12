import {RawBone} from "./rawBone";
import {html, TemplateResult} from "lit";
import {formatstring} from "../utils";

export class FileBone extends RawBone {
   constructor(boneValue: any, boneName = "", boneStructure = {}, mainInstance = null) {
    super(boneValue,boneName,boneStructure,mainInstance);
  }

  view(): string | TemplateResult<1> {
    function appendImage(data, boneStructure, lang = null) {
      let val = formatstring(data, boneStructure, lang);
      if (lang !== null) {
        if (boneStructure["multiple"]) {
          for (const i in val) {
            val[i] = html`<img width="32px" height="32px" src="${data[lang][i]["dest"]["downloadUrl"]}"> ${val[i]}`;
          }
        } else {
          val = html`<img width="32px" height="32px" src="${data[lang]["dest"]["downloadUrl"]}">${val}`;
        }

      } else {
        val = html`<img width="32px" height="32px" src="${data["dest"]["downloadUrl"]}">${val}`;
      }

      return val;
    }

    return super.view(appendImage);
  }

}
