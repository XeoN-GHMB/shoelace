import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/menu-item/menu-item.component.js';

const tagName = 'sl-menu-item';
Component.define('sl-menu-item');

/**
 * @summary Menu items provide options for the user to pick from in a menu.
 * @documentation https://shoelace.style/components/menu-item
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 * @dependency sl-popup
 * @dependency sl-spinner
 *
 * @slot - The menu item's label.
 * @slot prefix - Used to prepend an icon or similar element to the menu item.
 * @slot suffix - Used to append an icon or similar element to the menu item.
 * @slot submenu - Used to denote a nested menu.
 *
 * @csspart base - The component's base wrapper.
 * @csspart checked-icon - The checked icon, which is only visible when the menu item is checked.
 * @csspart prefix - The prefix container.
 * @csspart label - The menu item label.
 * @csspart suffix - The suffix container.
 * @csspart spinner - The spinner that shows when the menu item is in the loading state.
 * @csspart spinner__base - The spinner's base part.
 * @csspart submenu-icon - The submenu icon, visible only when the menu item has a submenu (not yet implemented).
 *
 * @cssproperty [--submenu-offset=-2px] - The distance submenus shift to overlap the parent menu.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlMenuItem'
});

export default reactWrapper;
