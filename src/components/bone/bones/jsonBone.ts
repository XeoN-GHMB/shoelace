// @ts-nocheck
import {BoneValue, RawBone} from "./rawBone";
import {formatstring} from "../utils";
import {html,TemplateResult} from "lit";

export class JsonBone extends RawBone {
  view(formater: () => BoneValue = formatstring): string | TemplateResult<1> {
    function renderjson(data, boneStructure, lang: string | null = null) {
      return html`<pre>${JSON.stringify(data,null, 2)}</pre>`;
    }
    return super.view(renderjson);
  }
}
