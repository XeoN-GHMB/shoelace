import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {emit} from '../../internal/event';
import {watch} from '../../internal/watch';
import styles from './bone.styles';
import {boneFormatter} from "./boneViewRenderer.tsx";
import {boneEditor} from "./boneEditRenderer.tsx";
import {watchProps} from "../../internal/watchProps";

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
  bone:any;
  initBoneValue:any;
  /** set boneStructure. */
  @property({type: Object, attribute: false}) boneStructure: Object;

  /** set boneValue. */
  @property({type: Object, attribute: false}) boneValue: any;

  /** set boneValue. */
  @property({type: Object, attribute: false}) boneName: string;

  /** set renderType. */
  @property({type: Object, reflect: true}) renderType: string = "view";

  /** Gets boneValue */
  get getBoneValue():any {
    console.log("init = "+this.initBoneValue)
    return this.boneValue;
  }
  @watchProps(['boneStructure', 'boneValue', "renderType"])
  optionUpdate() {
    this.initBoneValue=this.boneValue;
    if (this.boneStructure === null) {
      return;
    }
    if (this.renderType === "view") {
      this.bone = boneFormatter(this.boneStructure, this.boneValue)
    }
    if (this.renderType === "edit") {
      console.log("render edit")
      this.bone = boneEditor(this)
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
