import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/table/table.component.js';

import { type EventName } from '@lit-labs/react';
import { SlSelectionChangedEvent } from '../../../src/events/events';

const tagName = 'sl-table';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlSelectionChanged: 'sl-selectionChanged' as EventName<SlSelectionChangedEvent>
  },
  displayName: 'SlTable'
});

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @event sl-selectionChanged - Emits selection change event
 *
 * @slot - Place a Table
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --table-head-background - Table head background
 * @cssproperty --table-head-color - Table head textcolor
 * @cssproperty --table-head-background-hover - Table head background on hover
 * @cssproperty --table-head-color-hover - Table head textcolor on hover
 * @cssproperty --table-row-color-even - even row background color
 * @cssproperty --table-row-color-hover - row hover color
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
