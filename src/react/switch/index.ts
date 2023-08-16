import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/switch/switch.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlBlurEvent } from '../../../src/events/events';
import type { SlChangeEvent } from '../../../src/events/events';
import type { SlInputEvent } from '../../../src/events/events';
import type { SlFocusEvent } from '../../../src/events/events';
import type { SlInvalidEvent } from '../../../src/events/events';
export type { SlBlurEvent } from '../../../src/events/events';
export type { SlChangeEvent } from '../../../src/events/events';
export type { SlInputEvent } from '../../../src/events/events';
export type { SlFocusEvent } from '../../../src/events/events';
export type { SlInvalidEvent } from '../../../src/events/events';

const tagName = 'sl-switch';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur' as EventName<SlBlurEvent>,
    onSlChange: 'sl-change' as EventName<SlChangeEvent>,
    onSlInput: 'sl-input' as EventName<SlInputEvent>,
    onSlFocus: 'sl-focus' as EventName<SlFocusEvent>,
    onSlInvalid: 'sl-invalid' as EventName<SlInvalidEvent>
  },
  displayName: 'SlSwitch'
});

/**
 * @summary Switches allow the user to toggle an option on or off.
 * @documentation https://shoelace.style/components/switch
 * @status stable
 * @since 2.0
 *
 * @slot - The switch's label.
 *
 * @event sl-blur - Emitted when the control loses focus.
 * @event sl-change - Emitted when the control's checked state changes.
 * @event sl-input - Emitted when the control receives input.
 * @event sl-focus - Emitted when the control gains focus.
 * @event sl-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The control that houses the switch's thumb.
 * @csspart thumb - The switch's thumb.
 * @csspart label - The switch's label.
 *
 * @cssproperty --width - The width of the switch.
 * @cssproperty --height - The height of the switch.
 * @cssproperty --thumb-size - The size of the thumb.
 */
class SlComponent extends React.Component<Parameters<typeof component>[0]> {
  constructor(...args: Parameters<typeof component>) {
    super(...args);
    Component.define(tagName);
  }

  render() {
    const { children, ...props } = this.props;
    return React.createElement(component, props, children);
  }
}

export default SlComponent;
