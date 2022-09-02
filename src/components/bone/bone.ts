import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { watch } from '../../internal/watch';
import styles from './bone.styles';
import {boneFormatter} from "./boneViewRenderer.tsx";
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
  viewBone="";
  /** set boneStructure. */
  @property({type: Object, attribute: false}) boneStructure: Object;

  /** set boneValue. */
  @property({type: Object, attribute: false}) boneValue: any;

  @watchProps(['boneStructure','boneValue'])
  optionUpdate() {

    if(this.boneStructure===null)
    {
      return;
    }

    this.viewBone=boneFormatter(this.boneStructure,this.boneValue)
    console.log(this.viewBone)
  }

  render() {
    console.log(this.viewBone)
    return html`${this.viewBone}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-bone': SlBone;
  }
}
