import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tab/tab.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlCloseEvent } from '../../../src/events/events';
export type { SlCloseEvent } from '../../../src/events/events';

const tagName = 'sl-tab';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlClose: 'sl-close' as EventName<SlCloseEvent>
  },
  displayName: 'SlTab'
});

/**
 * @summary Tabs are used inside [tab groups](/components/tab-group) to represent and activate [tab panels](/components/tab-panel).
 * @documentation https://shoelace.style/components/tab
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon-button
 *
 * @slot - The tab's label.
 *
 * @event sl-close - Emitted when the tab is closable and the close button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart close-button - The close button, an `<sl-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
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
