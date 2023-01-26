import { classMap } from 'lit/directives/class-map.js';
import { customElement } from 'lit/decorators.js';
import { HasSlotController } from '../../internal/slot';
import { html } from 'lit';
import ShoelaceElement from '../../internal/shoelace-element';
import styles from './card.styles';
import {property} from "lit/decorators.js";
import type { CSSResultGroup } from 'lit';

/**
 * @summary Cards can be used to group related subjects in a container.
 * @documentation https://shoelace.style/components/card
 * @status stable
 * @since 2.0
 *
 * @slot - The card's main content.
 * @slot header - An optional header for the card.
 * @slot footer - An optional footer for the card.
 * @slot image - An optional image to render at the start of the card.
 *
 * @event sl-change - Emitted when the control's checked state changes.
 *
 * @csspart base - The component's base wrapper.
 * @csspart image - The container that wraps the card's image.
 * @csspart header - The container that wraps the card's header.
 * @csspart body - The container that wraps the card's main content.
 * @csspart footer - The container that wraps the card's footer.
 *
 * @cssproperty --border-color - The card's border color, including borders that occur inside the card.
 * @cssproperty --border-radius - The border radius for the card's edges.
 * @cssproperty --border-width - The width of the card's borders.
 * @cssproperty --padding - The padding to use for the card's sections.
 */
@customElement('sl-card')
export default class SlCard extends ShoelaceElement {
  static styles: CSSResultGroup = styles;

  /** Allows selecting the card via click or programmatically. */
  @property({ type: Boolean, reflect: true }) selectable = false;

  /** Draws the checkbox in a selected state. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** vertical card */
  @property({ type: Boolean, reflect: true }) horizontal = false;

  private readonly hasSlotController = new HasSlotController(this, 'footer', 'header', 'image');

  handleClick() {
    if (!this.selectable) return
    this.selected = !this.selected;
    this.emit("sl-change")
  }

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          card: true,
          'card--checked': this.selectable && this.selected,
          'card-horizontal':this.horizontal,
          'card--has-footer': this.hasSlotController.test('footer'),
          'card--has-image': this.hasSlotController.test('image'),
          'card--has-header': this.hasSlotController.test('header')
        })}
        @click=${this.handleClick}
        @keyDown=${this.handleClick}
      >
        <div part="image" class=${classMap({'card__image': true})}>
          <slot name="image"></slot>
        </div>
        <div part="group" class="card_group">
          <div part="header" class="card__header">
            <slot name="header"></slot>
          </div>

          <div part="body" class="card__body">
            <slot></slot>
          </div>

          <div part="footer" class="card__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-card': SlCard;
  }
}
