import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tag/tag.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlRemoveEvent } from '../../../src/events/events';
export type { SlRemoveEvent } from '../../../src/events/events';

const tagName = 'sl-tag';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlRemove: 'sl-remove' as EventName<SlRemoveEvent>
  },
  displayName: 'SlTag'
});

/**
 * @summary Tags are used as labels to organize things or to indicate a selection.
 * @documentation https://shoelace.style/components/tag
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon-button
 *
 * @slot - The tag's content.
 *
 * @event sl-remove - Emitted when the remove button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart content - The tag's content.
 * @csspart remove-button - The tag's remove button, an `<sl-icon-button>`.
 * @csspart remove-button__base - The remove button's exported `base` part.
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
