import {html} from "lit";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {formatstring} from "../utils";
export class RawBone
{
  boneValue;
  boneName;
  boneStructure;
  constructor(value: any, boneName = "",boneStructure={}) {
      this.boneValue=value;
      this.boneName=boneName;
      this.boneStructure=boneStructure;
  }
  
  view(formater:Function=formatstring)
  {
     if (this.boneValue === null) {
      return "-";
    }
    if (this.boneStructure["languages"] !== null) {


      return html`
        <sl-tab-group>
          ${this.getTabs()}
          ${this.getTabPannels(formater)}
        </sl-tab-group>`;

    } else {


      if (this.boneStructure["multiple"]) {
        if (!Array.isArray(this.boneValue)) {
          this.boneValue = [this.boneValue];
        }
        for (const index in this.boneValue) {

          this.boneValue[index] = formater(this.boneValue[index], this.boneStructure, null);
        }
        return html`${this.boneValue.map((val: any) => [
          html`${val}<br>`
        ])}`


      }
    }
    if (this.boneStructure["type"].startsWith("text")) {
      return html`${unsafeHTML(this.boneValue)}`;
    }
    return formater(this.boneValue, this.boneStructure)
  }


   getTabs() {
    let tabs: any = [];
    for (const lang of this.boneStructure["languages"]) {

      tabs.push(html`
        <sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`);
    }
    return tabs
  }


  getTabPannels(formater: Function = formatstring) {
    //We are when languages not null
    let tabpannels: any = [];
    if (this.boneStructure["format"] === undefined) {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {
          if (!Array.isArray(this.boneValue[lang])) {
            this.boneValue[lang] = [this.boneValue[lang]];
          }
          tabpannels.push(html`
            <sl-tab-panel name="${lang}"> ${this.boneValue[lang].map((val: any) => [html`${val}<br>`])}
            </sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">-</sl-tab-panel>`);
          } else {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">${this.boneValue[lang].toString()}</sl-tab-panel>`);
          }

        }
      }
    } else {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {

          console.log("call format", this.boneValue,)
          this.boneValue[lang] = formater(this.boneValue, this.boneStructure, lang);


          tabpannels.push(html`
            <sl-tab-panel name="${lang}">${this.boneValue[lang].map((val: any) => [html`${val}<br>`])}</sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpannels += html`
              <sl-tab-panel name="${lang}">-</sl-tab-panel>`;
          } else {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">${formater(this.boneValue, this.boneStructure, lang)}</sl-tab-panel>`);
          }

        }
      }
    }

    return tabpannels;


  }

}
