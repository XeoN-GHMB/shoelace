import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio-button/radio-button.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlBlurEvent } from '../../../src/events/events';
import type { SlFocusEvent } from '../../../src/events/events';
export type { SlBlurEvent } from '../../../src/events/events';
export type { SlFocusEvent } from '../../../src/events/events';

const tagName = 'sl-radio-button';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur' as EventName<SlBlurEvent>,
    onSlFocus: 'sl-focus' as EventName<SlFocusEvent>
  },
  displayName: 'SlRadioButton'
});

/**
 * @summary Radios buttons allow the user to select a single option from a group using a button-like control.
 * @documentation https://shoelace.style/components/radio-button
 * @status stable
 * @since 2.0
 *
 * @slot - The radio button's label.
 * @slot prefix - A presentational prefix icon or similar element.
 * @slot suffix - A presentational suffix icon or similar element.
 *
 * @event sl-blur - Emitted when the button loses focus.
 * @event sl-focus - Emitted when the button gains focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart button - The internal `<button>` element.
 * @csspart button--checked - The internal button element when the radio button is checked.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart label - The container that wraps the radio button's label.
 * @csspart suffix - The container that wraps the suffix.
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
