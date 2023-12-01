import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/radio/radio.component.js';

import { type EventName } from '@lit/react';
import type { SlBlurEvent } from '../../events/events';
import type { SlFocusEvent } from '../../events/events';
export type { SlBlurEvent } from '../../events/events';
export type { SlFocusEvent } from '../../events/events';

const tagName = 'sl-radio';
Component.define('sl-radio');

/**
 * @summary Radios allow the user to select a single option from a group.
 * @documentation https://shoelace.style/components/radio
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 *
 * @slot - The radio's label.
 *
 * @event sl-blur - Emitted when the control loses focus.
 * @event sl-focus - Emitted when the control gains focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The circular container that wraps the radio's checked state.
 * @csspart control--checked - The radio control when the radio is checked.
 * @csspart checked-icon - The checked icon, an `<sl-icon>` element.
 * @csspart label - The container that wraps the radio's label.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur' as EventName<SlBlurEvent>,
    onSlFocus: 'sl-focus' as EventName<SlFocusEvent>
  },
  displayName: 'SlRadio'
});

export default reactWrapper;
