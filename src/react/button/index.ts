import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/button/button.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlBlurEvent } from '../../../src/events/events';
import type { SlFocusEvent } from '../../../src/events/events';
import type { SlInvalidEvent } from '../../../src/events/events';
export type { SlBlurEvent } from '../../../src/events/events';
export type { SlFocusEvent } from '../../../src/events/events';
export type { SlInvalidEvent } from '../../../src/events/events';

const tagName = 'sl-button';
Component.define('sl-button');

/**
 * @summary Buttons represent actions that are available to the user.
 * @documentation https://shoelace.style/components/button
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 * @dependency sl-spinner
 *
 * @event sl-blur - Emitted when the button loses focus.
 * @event sl-focus - Emitted when the button gains focus.
 * @event sl-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @slot - The button's label.
 * @slot prefix - A presentational prefix icon or similar element.
 * @slot suffix - A presentational suffix icon or similar element.
 *
 * @csspart base - The component's base wrapper.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart label - The button's label.
 * @csspart suffix - The container that wraps the suffix.
 * @csspart caret - The button's caret icon, an `<sl-icon>` element.
 * @csspart spinner - The spinner that shows when the button is in the loading state.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur' as EventName<SlBlurEvent>,
    onSlFocus: 'sl-focus' as EventName<SlFocusEvent>,
    onSlInvalid: 'sl-invalid' as EventName<SlInvalidEvent>
  },
  displayName: 'SlButton'
});

export default reactWrapper;
