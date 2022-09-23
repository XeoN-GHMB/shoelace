import { html } from 'lit';
import ShoelaceElement from '../../internal/shoelace-element';
import { customElement, property } from 'lit/decorators.js';
import { getChildrenElement } from '../../utilities/common';
import SlAcPanel from '../ac-panel/ac-panel';
import styles from './collapse.styles';

/**
 * @since 2.0
 * @status experimental
 * @dependency sl-icon
 * @event {{tab:SlAcPanel}} sl-before-tab-change - Emitted before a panel active change.
 * @event {{tab:SlAcPanel}} sl-tab-change - Emitted when a panel active changed.
 * @slot - The default slot.
 * @csspart base - The component's base wrapper.
 * @cssproperty --sl-collapse-border-color - collapse border color.
 */
@customElement('sl-collapse')
export default class SlCollapse extends ShoelaceElement {
  static styles = styles;
  /**Whether to allow opening multiple  */
  @property({ type: Boolean, reflect: true }) multi = false;
  render() {
    return html`<div part="base"><slot id="slot"></slot></div> `;
  }
  get childTabPanel() {
    return getChildrenElement(this, 'sl-ac-panel') as Array<SlAcPanel>;
  }
  /**
   * Find sub sl-ac-panel by key
   * @param key
   * @returns
   */
  findTab(key: string): SlAcPanel | undefined {
    return this.childTabPanel.find(item => {
      return item.key == key;
    });
  }
  /**
   * Get the index in the parent node
   * @param tab
   * @returns
   */
  getTabIndex(tab: SlAcPanel) {
    const children = this.childTabPanel;
    return children.indexOf(tab);
  }
  findTabByIndex(index: number): SlAcPanel | null {
    const children = this.childTabPanel;
    return index < children.length ? children[index] : null;
  }
  public get activeTab() {
    return this.childTabPanel.filter(item => {
      return item.active;
    });
  }
  public setTabToActive(tab: SlAcPanel, active = false) {
    if (active && !this.multi) {
      const tabs = this.activeTab;
      tabs.forEach(item => {
        item.active = false;
      });
    }
    tab.active = active;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-collapse': SlCollapse;
  }
}
