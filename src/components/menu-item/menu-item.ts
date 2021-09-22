import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import styles from './menu-item.styles';

import '../icon/icon';
import { watchProps } from '../../internal/watchProps';

/**
 * @since 2.0
 * @status stable
 *
 * @dependency sl-icon
 *
 * @slot - The menu item's label.
 * @slot prefix - Used to prepend an icon or similar element to the menu item.
 * @slot suffix - Used to append an icon or similar element to the menu item.
 *
 * @csspart base - The component's base wrapper.
 * @csspart checked-icon - The container that wraps the checked icon.
 * @csspart prefix - The prefix container.
 * @csspart label - The menu item label.
 * @csspart suffix - The suffix container.
 */
@customElement('sl-menu-item')
export default class SlMenuItem extends LitElement {
  static styles = styles;

  @query('.menu-item') menuItem: HTMLElement;

  /** Draws the item in a checked state. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** A unique value to store in the menu item. This can be used as a way to identify menu items when selected. */
  @property() value: number | string = '';

  /** Draws the menu item in a disabled state. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** hightlight ����˵��� */
  @property({ type: Boolean, reflect: true }) highlight = false;

  firstUpdated() {
    this.setAttribute('role', 'menuitem');
  }

  @watchProps(['checked', 'disabled'])
  handleCheckedChange() {
    this.setAttribute('aria-checked', String(this.checked));
    this.setAttribute('aria-disabled', String(this.disabled));
  }

  render() {
    return html`
      <sl-ripple class="ripple-wrap" ?disabled=${this.disabled}>
        <div
          part="base"
          class=${classMap({
            'menu-item': true,
            'menu-item--checked': this.checked,
            'menu-item--highlight': this.highlight,
            'menu-item--disabled': this.disabled
          })}
        >
          <span part="checked-icon" class="menu-item__check">
            <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
          </span>

          <span part="prefix" class="menu-item__prefix">
            <slot name="prefix"></slot>
          </span>

          <span part="label" class="menu-item__label">
            <slot></slot>
          </span>

          <span part="suffix" class="menu-item__suffix">
            <slot name="suffix"></slot>
          </span>
        </div>
      </sl-ripple>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-item': SlMenuItem;
  }
}
