import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/image-comparer/image-comparer.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlChangeEvent } from '../../../src/events/events';
export type { SlChangeEvent } from '../../../src/events/events';

const tagName = 'sl-image-comparer';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlChange: 'sl-change' as EventName<SlChangeEvent>
  },
  displayName: 'SlImageComparer'
});

/**
 * @summary Compare visual differences between similar photos with a sliding panel.
 * @documentation https://shoelace.style/components/image-comparer
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 *
 * @slot before - The before image, an `<img>` or `<svg>` element.
 * @slot after - The after image, an `<img>` or `<svg>` element.
 * @slot handle - The icon used inside the handle.
 *
 * @event sl-change - Emitted when the position changes.
 *
 * @csspart base - The component's base wrapper.
 * @csspart before - The container that wraps the before image.
 * @csspart after - The container that wraps the after image.
 * @csspart divider - The divider that separates the images.
 * @csspart handle - The handle that the user drags to expose the after image.
 *
 * @cssproperty --divider-width - The width of the dividing line.
 * @cssproperty --handle-size - The size of the compare handle.
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
