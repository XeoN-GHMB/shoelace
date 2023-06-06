import '../checkbox/checkbox';
import '../icon/icon';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit';
import { LocalizeController } from '../../utilities/localize';
import { watch } from '../../internal/watch';
import ShoelaceElement from '../../internal/shoelace-element';
import styles from './filter-checkbox.styles';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://shoelace.style/components/filter-checkbox
 * @status experimental
 * @viur 0.5
 * @since 2.0
 *
 * @dependency sl-example
 *
 * @event sl-event-name - Emitted as an example.
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customElement('sl-filter-checkbox')
export default class SlFilterCheckbox extends ShoelaceElement {
  static styles: CSSResultGroup = styles;

  private readonly localize = new LocalizeController(this);

  /** An example attribute. */
  @property() attr = 'example';

  @watch('someProperty')
  doSomething() {
    // Example event
    this.emit('sl-event-name');
  }

  render() {
    return html`<div><sl-checkbox></sl-checkbox><sl-icon name="chevron-down"></sl-icon></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-filter-checkbox': SlFilterCheckbox;
  }
}
