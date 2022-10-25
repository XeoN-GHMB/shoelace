// @ts-nocheck
import {StringBone} from "./stringBone";

export class EmailBone extends StringBone {
  getEditor(value: string, boneName: string, lang: any = null): HTMLElement {
    const emailBone =  super.getEditor(value, boneName, lang);
    emailBone.type="email";
    return emailBone;
  }

}
