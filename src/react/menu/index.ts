import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/menu/menu.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlSelectEvent } from '../../../src/events/events';
export type { SlSelectEvent } from '../../../src/events/events';

const tagName = 'sl-menu';
Component.define('sl-menu');

/**
 * @summary Menus provide a list of options for the user to choose from.
 * @documentation https://shoelace.style/components/menu
 * @status stable
 * @since 2.0
 *
 * @slot - The menu's content, including menu items, menu labels, and dividers.
 *
 * @event {{ item: SlMenuItem }} sl-select - Emitted when a menu item is selected.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlSelect: 'sl-select' as EventName<SlSelectEvent>
  },
  displayName: 'SlMenu'
});

export default reactWrapper;
