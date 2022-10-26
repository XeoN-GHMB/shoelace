// @ts-nocheck
import {customElement, property} from 'lit/decorators.js';
import {emit} from '../../internal/event';
import {watchProps} from "../../internal/watchProps";
import styles from './bone.styles';
import {BoneEditRenderer} from "./boneEditRenderer";
import {BoneViewRenderer} from "./boneViewRenderer";
import SlDetails from "../details/details";
import ShoelaceElement from "../../internal/shoelace-element";
import {BoneError, BoneStructure} from "./interfaces";
import {BoneValue} from "./bones/rawBone";
import {html} from "lit";



/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @dependency sl-example
 *
 * @event sl-event-name - Emitted as an example.
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customElement('sl-bone')
export default class SlBone extends ShoelaceElement {


  static styles = styles;
  bone: HTMLFormElement;
  initBoneValue: any;
  internboneValue: Record<string, BoneValue>;
  relationalCache:Record<string, object> = {};
  previousBoneValues: Record<string, BoneValue[]> = {};
  /** set boneStructure */
  @property({type: Object, attribute: false}) boneStructure: any;

  /** set boneValue */
  @property({type: Object, attribute: false}) boneValue: any;

  /** set boneValue */
  @property({type: Object, attribute: false}) boneName: string;

  /** set renderType */
  @property({type: String, reflect: true}) renderType = "view";

  /** set renderLabel */
  @property({type: Boolean, reflect: true}) renderLabel = false;

  /** set rendersaveButton */
  @property({type: Boolean, reflect: true}) rendersaveButton = false;
  /** set boneError */
  @property() errors: BoneError[];
  /** set boneValue */
  @property({type: Boolean, attribute: false}) inTable = false;

  /** Gets boneValue */
  get getBoneValue(): any {
    return this._getBoneValue();
  }

  _getBoneValue():BoneValue {
    return this.internboneValue[this.boneName];
  }

  toFormValue() {
    function rewriteData(val:any, key:string|null = null):any[] {
      const ret = []
      if (Array.isArray(val)) {
        if (Object.values(val).filter(c => c === Object(c)).length > 0) {
          for (const [i, v] of val.entries()) {
            ret.push(rewriteData(v, `${key}.${i}`))
          }
        } else {
          for (const [_, v] of val.entries()) {
            ret.push(rewriteData(v, key))
          }
        }
      } else if (val === Object(val)) {
        for (const [k, v] of Object.entries(val)) {
          if (key) {
            ret.push(rewriteData(v, `${key}.${k}`))
          } else {
            ret.push(rewriteData(v, k))
          }
        }
      } else {
        if (val === null) {
          val = ""
        }
        if (key !== null) {
          ret.push({[key]: val})
        }
      }
      return ret
    }

    let value = rewriteData(this.internboneValue[this.boneName], this.boneName)
    value = value.flat(10)
    return value;
  }

  toFormData() {
    const value = this.toFormValue();
    const formData: FormData = new FormData();
    for (const data of value) {
      for (const [k, v] of Object.entries(data)) {
        formData.append(k, v.toString());
      }
    }

    return formData
  }


  @watchProps(['boneStructure', 'boneValue', "renderTyp"])
  optionUpdate() {
    this.initBoneValue = this.boneValue;
    this.internboneValue = {[this.boneName]: this.boneValue};
    if (this.boneStructure === null || this.boneStructure === undefined) {
      return;
    }
    this.convertboneStructure(this.boneStructure);
    if (!this.boneStructure["visible"]) {
      return;
    }

    if (this.renderType === "view") {

      const boneViewer = new BoneViewRenderer(this.boneName, this.internboneValue[this.boneName], this.boneStructure, this);
      this.bone = boneViewer.boneFormatter();
    }
    if (this.renderType === "edit") {

      const boneEditor = new BoneEditRenderer(this.boneName, this.internboneValue[this.boneName], this.boneStructure, this);
      this.bone = boneEditor.getEditor();


    }


  }

  convertboneStructure(boneStructure: BoneStructure) {
    const isRelational = boneStructure["type"].startsWith("relational")
    const isRecord = boneStructure["type"].startsWith("record")
    if (isRecord) {
      const newboneStructure = {}
      if (Array.isArray(boneStructure["using"])) {
        for (let i = 0; i < boneStructure["using"].length; i++) {
          for (let j = 0; j < boneStructure["using"][i].length; j += 2) {

            newboneStructure[boneStructure["using"][i][j]] = boneStructure["using"][i][j + 1];

          }
        }
        boneStructure["using"] = newboneStructure;
      }

      for (const [key, value] of Object.entries(boneStructure["using"])) {
        const isRelational = value["type"].startsWith("relational")
        const isRecord = value["type"].startsWith("record")
        if (isRelational || isRecord) {
          boneStructure["using"][key] = this.convertboneStructure(value);
        }
      }
    }

    if (isRelational) {
      const newboneStructure = {}
      if (Array.isArray(boneStructure["relskel"])) {


        for (let i = 0; i < boneStructure["relskel"].length; i++) {
          for (let j = 0; j < boneStructure["relskel"][i].length; j += 2) {

            newboneStructure[boneStructure["relskel"][i][j]] = boneStructure["relskel"][i][j + 1];

          }
        }
        boneStructure["relskel"] = newboneStructure;

      } else {
        for (const [key, value] of Object.entries(boneStructure["relskel"])) {
          const isRelational = value["type"].startsWith("relational")
          const isRecord = value["type"].startsWith("record")
          if (isRelational || isRecord) {
            boneStructure["relskel"][key] = this.convertboneStructure(value);
          }
        }
      }
    }
    return boneStructure;
  }


  //Events
  handleChange(type = "edit") {
    const options = {
      boneValue: this._getBoneValue(),
      boneName: this.boneName,
      formValue: this.toFormValue(),
      formData: this.toFormData(),
      type: type
    }
    console.log("emit", options)
    emit(this, 'sl-boneChange', {
      detail: options
    });
  }

  @watchProps(["errors"])
  handleError() {

    //Todo Styling?
    if (this.bone === undefined || this.bone === null) {
      return;
    }
    if (this.errors === undefined || this.errors === null) {
      return;
    }

    this.bone.querySelectorAll(".error-container").forEach((element:HTMLElement) => {
      if (this.errors.length === 0) {
        element.style.display = "none";
      }
      element.querySelector(".error-msg").innerText = "";
    })

    for (const error of this.errors) {
      if (this.boneName === error["fieldPath"][0])
        if (error["severity"] > 1) {
          const element: SlDetails = this.bone.querySelector('[data-name="' + error["fieldPath"].join(".") + "_errorcontainer" + '"]');

          if (element !== null) {
            element.style.display = "";
            element.open = true;
            element.querySelector(".error-msg").innerText += error["errorMessage"];
          }

        }

    }


  }

  render() {
    return html`${this.bone}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-bone': SlBone;
  }
}
