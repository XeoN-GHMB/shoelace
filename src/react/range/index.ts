import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/range/range.component.js';

import { type EventName } from '@lit-labs/react';
import { SlBlurEvent } from '../../../src/events/events';
import { SlChangeEvent } from '../../../src/events/events';
import { SlFocusEvent } from '../../../src/events/events';
import { SlInputEvent } from '../../../src/events/events';
import { SlInvalidEvent } from '../../../src/events/events';

const tagName = 'sl-range';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur' as EventName<SlBlurEvent>,
    onSlChange: 'sl-change' as EventName<SlChangeEvent>,
    onSlFocus: 'sl-focus' as EventName<SlFocusEvent>,
    onSlInput: 'sl-input' as EventName<SlInputEvent>,
    onSlInvalid: 'sl-invalid' as EventName<SlInvalidEvent>
  },
  displayName: 'SlRange'
});

/**
 * @summary Ranges allow the user to select a single value within a given range using a slider.
 * @documentation https://shoelace.style/components/range
 * @status stable
 * @since 2.0
 *
 * @slot label - The range's label. Alternatively, you can use the `label` attribute.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event sl-blur - Emitted when the control loses focus.
 * @event sl-change - Emitted when an alteration to the control's value is committed by the user.
 * @event sl-focus - Emitted when the control gains focus.
 * @event sl-input - Emitted when the control receives input.
 * @event sl-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The range's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal `<input>` element.
 * @csspart tooltip - The range's tooltip.
 *
 * @cssproperty --thumb-size - The size of the thumb.
 * @cssproperty --tooltip-offset - The vertical distance the tooltip is offset from the track.
 * @cssproperty --track-color-active - The color of the portion of the track that represents the current value.
 * @cssproperty --track-color-inactive - The of the portion of the track that represents the remaining value.
 * @cssproperty --track-height - The height of the track.
 * @cssproperty --track-active-offset - The point of origin of the active track.
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
