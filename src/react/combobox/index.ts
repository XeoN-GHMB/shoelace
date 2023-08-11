import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/combobox/combobox.component.js';

import { type EventName } from '@lit-labs/react';
import { SlItemSelectEvent } from '../../../src/events/events';
import { SlChangeEvent } from '../../../src/events/events';
import { SlInputEvent } from '../../../src/events/events';

const tagName = 'sl-combobox';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlItemSelect: 'sl-item-select' as EventName<SlItemSelectEvent>,
    onSlChange: 'sl-change' as EventName<SlChangeEvent>,
    onSlInput: 'sl-input' as EventName<SlInputEvent>
  },
  displayName: 'SlCombobox'
});

/**
 * @since 2.X
 * @status beta
 *
 * @dependency sl-input
 * @dependency sl-dropdown
 * @dependency sl-menu
 * @dependency sl-menu-item
 *
 * @event {{ item: SlMenuItem }} sl-item-select - Emitted when a suggestion is selected.
 * @event sl-change - Emitted when the input's value changes.
 * @event sl-input - Emitted when the input receives input.
 *
 * @csspart base - The component's base wrapper, a sl-dropdown.
 * @csspart input - The sl-input component.
 * @csspart menu - The sl-menu component.
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
