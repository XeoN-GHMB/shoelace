import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { watchProps } from '../../internal/watchProps';
import styles from './layout.styles';

/**
 * @since 2.0
 * @status experimental
 * @description flex layout component implementation, the default is flex vertical layout
 *
 *
 *
 *
 * @slot - The default slot.
 *
 *
 *
 *
 *
 */
@customElement('sl-layout')
export default class SlLayout extends LitElement {
  static styles = styles;

  /** Flex row layout by row or not */
  @property({ type: Boolean, attribute: 'row' }) row = true;
  /** Flex column layout by column or not */
  @property({ type: Boolean, attribute: 'column' }) column = false;

  /** Whether the primary and secondary axes are centered */
  @property({ type: Boolean, attribute: 'center' }) center = false;

  /** Whether to expand the remaining space */
  @property({ type: Boolean, attribute: 'expand' }) expand = false;

  /** Spindle sub-item alignment  */
  @property({ type: String, attribute: 'main' }) main: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

  /** Secondary axis sub-item alignment */
  @property({ type: String, attribute: 'cross' }) cross: 'start' | 'end' | 'center' | 'baseline' | 'stretch';

  @watchProps(['main', 'cross'])
  setXYChange() {
    let x;
    switch (this.main) {
      case 'start':
        x = 'flex-start';
        break;
      case 'end':
        x = 'flex-end';
        break;
      default:
        x = this.main;
        break;
    }
    if (x) {
      this.style.justifyContent = x;
    } else {
      this.style.justifyContent = 'flex-start';
    }

    let y;
    switch (this.cross) {
      case 'start':
        y = 'flex-start';
        break;
      case 'end':
        y = 'flex-end';
        break;
      default:
        y = this.cross;
        break;
    }
    if (y) {
      this.style.alignItems = y;
    } else {
      this.style.alignItems = 'stretch';
    }
  }
  render() {
    return html`<slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-layout': SlLayout;
  }
}
