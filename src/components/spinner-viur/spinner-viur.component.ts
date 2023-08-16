import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './spinner-viur.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Spinners are used to show the progress of an indeterminate operation.
 * @documentation https://shoelace.style/components/spinner-viur
 * @since 2.0
 * @status stable
 * @viur 0.5
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
@customElement('sl-spinner-viur')
export default class SlSpinnerViur extends ShoelaceElement {
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
    'sl-spinner-viur': SlSpinnerViur;
  }
}

