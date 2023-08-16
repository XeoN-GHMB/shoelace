import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/page-btn/page-btn.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlPageChangeEvent } from '../../../src/events/events';
import type { SlPageBeforeChangeEvent } from '../../../src/events/events';
export type { SlPageChangeEvent } from '../../../src/events/events';
export type { SlPageBeforeChangeEvent } from '../../../src/events/events';

const tagName = 'sl-page-btn';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlPageChange: 'sl-page-change' as EventName<SlPageChangeEvent>,
    onSlPageBeforeChange: 'sl-page-before-change' as EventName<SlPageBeforeChangeEvent>
  },
  displayName: 'SlPageBtn'
});

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @dependency sl-button,sl-select,sl-icon
 *
 * @event sl-page-change - Emitted when current page changed   .
 * @event sl-page-before-change - Emitted before  page changed,use can defaultPrevented ,then sl-page-change can not be emit    .
 *
 * @slot prefix The prefix slot.
 * @slot no-data - when total=0 to show .
 * @slot default - tool bar end to show .

 * @csspart base - The component's base wrapper.
 * @csspart pageWrap - The component's to page button  wrapper.
 *
 *
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
