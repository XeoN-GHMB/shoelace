import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { watchProps } from '../../internal/watchProps';
/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
@customElement('sl-col')
export default class SlCol extends LitElement {
  static styles = css`
    :host {
      grid-column: span var(--sl-col-span, 1);
      grid-row: span var(--sl-col-row, 1);
    }
  `;
  /** 占多少列 */
  @property({ type: Number, reflect: true, attribute: 'span' }) span = 1;

  /** 占多少行 */
  @property({ type: Number, reflect: true, attribute: 'row' }) row = 1;

  @watchProps(['span', 'row'])
  changeSpanMethod() {
    this.style.setProperty('--sl-col-span', this.span + '');
    this.style.setProperty('--sl-col-row', this.row + '');
  }
  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-col': SlCol;
  }
}
