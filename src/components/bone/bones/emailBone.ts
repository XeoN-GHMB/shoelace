import {RawBone} from "./rawBone";

export class EmailBone extends RawBone {
  getEditor(value: any, boneName: string, lang: any = null): HTMLElement {
    const emailBone =  super.getEditor(value, boneName, lang);
    emailBone.type="email";
    return emailBone;
  }

}
