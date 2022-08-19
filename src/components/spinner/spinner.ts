import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './spinner.styles';
import type { CSSResultGroup } from 'lit';

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
@customElement('sl-spinner')
export default class SlSpinner extends LitElement {
  static styles: CSSResultGroup = styles;

  render() {
    return html` <div part="base" class="loader">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-spinner': SlSpinner;
  }
}
