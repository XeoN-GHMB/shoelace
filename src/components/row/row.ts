import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { watchProps } from '../../internal/watchProps';
import './col';
import styles from './row.styles';
/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 *
 *
 * @slot - The default slot.
 *
 *
 */
@customElement('sl-row')
export default class SlRow extends LitElement {
  static styles = styles;

  /** How many columns of grid equal division */
  @property({ type: Number, attribute: 'columns' }) columns = 12;
  /** grid Cell spacing */
  @property({ type: String, attribute: 'grap' }) grap: string = '0';

  @watchProps(['columns', 'grap'])
  changeSpanMethod() {
    let grapPx = isNaN(Number(this.grap)) ? this.grap : Number(this.grap) + 'px';
    this.style.setProperty('--sl-row-columns', this.columns + '');
    this.style.setProperty('--sl-row-grap', grapPx);
  }
  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-row': SlRow;
  }
}
