import { html } from 'lit';
import { customElement, queryAssignedNodes } from 'lit/decorators.js';
import styles from './details-group.styles';
import ShoelaceElement from '../../internal/shoelace-element.js';

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @slot - The default slot.
 *
 * @cssproperty --details-gap - The gap between the detail boxes.
 */
@customElement('sl-details-group')
export default class SlDetailsGroup extends ShoelaceElement {
  static styles = styles;

  @queryAssignedNodes('', true)
  currentSlotNodes: any;

  hasChanged() {
    this.registerDetails();
  }

  handleSlotChange() {
    this.registerDetails();
  }

  registerDetails() {
    let detailsList = Array.prototype.filter.call(
      this.currentSlotNodes,
      (node: any) => node.nodeType == Node.ELEMENT_NODE
    );

    if (detailsList) {
      for (const details of detailsList) {
        details.addEventListener('sl-show', (event: Event) => {
          [...detailsList].map(details => (details.open = event.target === details));
        });
      }
    }
  }

  render() {
    return html` <slot @slotchange=${this.handleSlotChange}> </slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-details-group': SlDetailsGroup;
  }
}
