import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/combobox/combobox.component.js';

import { type EventName } from '@lit/react';
import type { SlItemSelectEvent } from '../../../src/events/events';
import type { SlSelectEvent } from '../../../src/events/events';
import type { SlChangeEvent } from '../../../src/events/events';
import type { SlInputEvent } from '../../../src/events/events';
export type { SlItemSelectEvent } from '../../../src/events/events';
export type { SlSelectEvent } from '../../../src/events/events';
export type { SlChangeEvent } from '../../../src/events/events';
export type { SlInputEvent } from '../../../src/events/events';

const tagName = 'sl-combobox';
Component.define('sl-combobox');

/**
 * @since 2.0
 * @status stable
 * @viur 0.5
 *
 * @dependency sl-input
 * @dependency sl-dropdown
 * @dependency sl-menu
 * @dependency sl-menu-item
 *
 * @event {{ item: SlMenuItem }} sl-item-select - DEPRECATED - Emitted when a suggestion is selected.
 * @event {{ item: SlMenuItem }} sl-select - Emitted when a suggestion is selected.
 * @event sl-change - Emitted when the input's value changes.
 * @event sl-input - Emitted when the input receives input.
 *
 * @csspart base - The component's base wrapper, a sl-dropdown.
 * @csspart input - The sl-input component.
 * @csspart menu - The sl-menu component.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlItemSelect: 'sl-item-select' as EventName<SlItemSelectEvent>,
    onSlSelect: 'sl-select' as EventName<SlSelectEvent>,
    onSlChange: 'sl-change' as EventName<SlChangeEvent>,
    onSlInput: 'sl-input' as EventName<SlInputEvent>
  },
  displayName: 'SlCombobox'
});

export default reactWrapper;
