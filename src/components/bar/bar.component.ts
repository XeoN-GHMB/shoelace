import { html } from 'lit';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './bar.styles.js';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Use bar elements for vertical alignment and horizontal distribution.
 * @documentation https://shoelace.style/components/bar
 * @status experimental
 * @viur 0.7
 * @since 2.0
 *
 *
 * @slot left - elements placed left
 * @slot center - elements placed center
 * @slot right - elements placed right
 *
 * @csspart left - The component's left wrapper.
 * @csspart center - The component's center wrapper.
 * @csspart right - The component's right wrapper.
 *
 */
export default class SlBar extends ShoelaceElement {
  static styles: CSSResultGroup = styles;

  render() {
    return html`
      <slot part="left" name="left" class="bar-group bar-group--left"></slot>

      <slot part="center" name="center"  class="bar-group bar-group--center"></slot>

      <slot part="right" name="right" class="bar-group bar-group--right"></slot>
    `;
  }
}
