// @ts-nocheck
import {html} from "lit";
import {customElement, property} from 'lit/decorators.js';
import {emit} from '../../internal/event';
import ShoelaceElement, {ShoelaceFormControl} from "../../internal/shoelace-element";
import {watchProps} from "../../internal/watchProps";
import styles from './bone.styles';
import {BoneEditRenderer} from "./boneEditRenderer";
import {BoneViewRenderer} from "./boneViewRenderer";
import type SlDetails from "../details/details";
import type {BoneValue} from "./bones/rawBone";
import type {BoneError, BoneStructure} from "./interfaces";
import {SkelValues} from "./interfaces";
import {FormControlController} from "../../internal/form";
import {RawBone} from "./bones/rawBone";


/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @dependency sl-example
 *
 * @event sl-bone-change - Emitted when the bonevalues is change.
 * @event sl-bone-init - Emitted when the bonevalues is set or change the first time.
 * @event sl-bone-relational-select - If `inVi` is `true` we fire this event on relation selection.
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customElement('sl-bone')
export default class SlBone extends ShoelaceElement implements ShoelaceFormControl {

  //private readonly formControlController = new FormControlController(this, {value: this.getBoneValueforFormData});

  static styles = styles;
  bone: Object;
  boneInstance:any;
  initBoneValue: any;
  internboneValue: Record<string, BoneValue>;
  relationalCache: Record<string, object> = {};
  textboneCache: Record<string, object> = {};
  jsonboneCache: Record<string, object> = {};
  previousBoneValues: Record<string, BoneValue[]> = {};
  initFired = false;
  /** If we have a boneStructure we can set it */
  @property({type: Object, attribute: false}) boneStructure: any;

  /** set boneValue */
  @property({type: String, reflect: true}) boneValue: any;

  /** set the boneName */
  @property({type: String, reflect: true}) boneName: string;

  /** set renderType */
  @property({type: String, reflect: true}) renderType = "view";

  /** set renderLabel */
  @property({type: Boolean, reflect: true}) renderLabel = false;

  /** If true we render the Save Button in the edit view rendersaveButton */
  @property({type: Boolean, reflect: true}) rendersaveButton = false;
  /** set boneError */
  @property() errors: BoneError[];
  /** If true the Bone will be rendered in the table format*/
  @property({type: Boolean, attribute: false}) inTable = false;
  /** If true the relational bone fire an event for the VI*/
  @property({type: Boolean, attribute: false}) inVi = false;
  /** Can be set to true if the bone should be readonly*/
  @property({type: Boolean, reflect: true}) disabled = false;

  /** The url for uploading files and update bone values if we are in a table*/
  @property({type: String, reflect: true}) apiUrl = window.location.origin;
  //if we don't have a bone structure we can provide a bone over other parameter

  /** If we have no `boneStructure` we can set the name for a html form*/
  @property({type: String, reflect: true}) type = "";
  /** If we have no `boneStructure` we can set the type to render the right bone ('file' renders a fileBone) */
  @property({type: String, reflect: true}) name = null;

  /** Gets boneValue */
  get getBoneValue(): any {
    return this.internboneValue[this.boneName];
  }

  getBoneValueforFormData(boneInstance: SlBone): any {
    return boneInstance.toFormData().getAll(boneInstance.boneName);
  }


  toFormValue() {
    function rewriteData(val: any, key: string | null = null): any[] {
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
        if (v) {
          formData.append(k, v.toString());
        } else {
          formData.append(k, "");//We set it to nothing
        }

      }
    }

    return formData
  }


  @watchProps(['boneStructure', 'boneValue', "renderType", "disabled", "type"])
  optionUpdate() {
    //this.formControlController.setValidity(true);
    if (this.type !== "") {
      console.log("we got a type we try to set the bone without 'boneStructure'")
      console.log(this.boneValue)
      this.loadDefaultBoneStructure();
    }
    if (this.apiUrl.startsWith("http://localhost:"))//set apiurl for local devserver
    {
      this.apiUrl = "http://localhost:8080"
    }
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
      this.boneInstance = boneViewer;
      this.bone = boneViewer.boneFormatter();
    }
    if (this.renderType === "edit") {
      if (this.boneValue !== undefined && this.boneValue !== null) {
        this.handleInit()
      }
      else if(this.boneStructure["required"])
      {
        this.handleInit()
      }

      const boneEditor = new BoneEditRenderer(this.boneName, this.internboneValue[this.boneName], this.boneStructure, this);
      this.boneInstance = boneEditor;
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
      boneValue: this.getBoneValue,
      boneName: this.boneName,
      formValue: this.toFormValue(),
      formData: this.toFormData(),
      type: type
    }
    this.handleInit(options)
    //this.formControlController.updateValidity();

    emit(this, 'sl-bone-change', {
      detail: options
    });
  }

  handleInit(options) {
    if (!this.initFired) {
      if (options === undefined) {
        options = {
          boneValue: this.getBoneValue,
          boneName: this.boneName,
          formValue: this.toFormValue(),
          formData: this.toFormData(),
        }
      }
      options["type"] = "init";

      this.initFired = true;
      emit(this, 'sl-bone-init', {
        detail: options
      });
    }
  }

  openVISelect(boneName)//open special vi select for reletionalbones
  {
    emit(this, 'sl-bone-relational-select', {detail: {"boneName": boneName}});
  }

  addRelation(skel: Array<SkelValues> | SkelValues, boneName: string) {
    this.boneInstance.boneInstance.addRelation(skel, boneName)
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
    this.bone.querySelectorAll(".error-container").forEach((element: HTMLElement) => {
      if (this.errors.length === 0) {
        element.style.display = "none";
      }
      element.querySelector(".error-msg").innerText = "";
    })

    for (const error of this.errors) {
      if (this.boneName === error["fieldPath"][0])
        if (error["severity"] > 1) {
          const element: SlDetails = this.bone.querySelector(`[data-name="${error["fieldPath"].join(".")}_errorcontainer"]`);
          console.log("handle errror ? ",element,error)
          if (element !== null) {
            element.style.display = "";
            element.open = true;
            element.querySelector(".error-msg").innerText += error["errorMessage"];
          }

        }

    }


  }

  loadDefaultBoneStructure() {
    /**
     * this mehtod load default bone structure when no one is provided
     */
    if (this.name === null || this.name === undefined) {
      throw "no name provided";
    }
    this.boneName = this.name
    this.boneStructure = {
      descr: "",
      type: this.type,
      required: false,
      visible: true,
      readonly: false,
      unique: false,
      languages: null,
      emptyValue: null,
      multiple: true,
    }
  }

  checkValidity() { // for form
    return true;
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
