import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {emit} from '../../internal/event';
import {watch} from '../../internal/watch';
import {watchProps} from "../../internal/watchProps";
import styles from './bone.styles';
import {BoneEditRenderer} from "./boneEditRenderer";
import {BoneViewRenderer} from "./boneViewRenderer";


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
export default class SlBone extends LitElement {
  static styles = styles;
  bone: HTMLFormElement;
  initBoneValue: any;
  internboneValue: any;
  /** set boneStructure */
  @property({type: Object, attribute: false}) boneStructure:any;

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

  /** Gets boneValue */
  get getBoneValue(): any {
    return this._getBoneValue();
  }

  _getBoneValue() {
    return this.internboneValue[this.boneName];
  }


  @watchProps(['boneStructure', 'boneValue', "renderType"])
  optionUpdate() {
    this.initBoneValue = this.boneValue;
    this.internboneValue = {[this.boneName]: this.boneValue};
    if (this.boneStructure === null) {
      return;
    }
    this.convertboneStructure(this.boneStructure)
    if (this.renderType === "view") {

      const boneViewer = new BoneViewRenderer(this.boneStructure, this.boneValue, this.boneName, this)
      this.bone = boneViewer.boneFormatter();
    }
    if (this.renderType === "edit") {
      console.trace()
      const boneEditor = new BoneEditRenderer(this.boneStructure, this.boneValue, this.boneName, this)
      this.bone = boneEditor.boneEditor();
    }


  }

  convertboneStructure(boneStructure: any) {
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
        for (const [key, value] of Object.entries(boneStructure["using"])) {
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
  handleChange(formData: FormData, type = "edit") {
    console.trace()
    const options = {
      boneValue: this._getBoneValue(),
      boneName: this.boneName,
      formData: formData,
      type: type
    }

    if (this.initBoneValue == this._getBoneValue()) {
      options["type"] = "noChange";
    }

    emit(this, 'sl-boneChange', {
      detail: options
    });
  }

  handleError(error) {
    //Todo Styling?
    //Todo More than 1 msg
    console.log(`Add err msg to ${  error["fieldPath"].join(".")}`)
    const element = this.bone.querySelector(`[data-bone-name-index="${  error["fieldPath"].join(".")  }"]`);
    if (element) {
      element.helpText = html`<b>${error["errorMessage"]}</b>`;
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
