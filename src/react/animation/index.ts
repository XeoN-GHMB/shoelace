import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/animation/animation.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlCancelEvent } from '../../../src/events/events';
import type { SlFinishEvent } from '../../../src/events/events';
import type { SlStartEvent } from '../../../src/events/events';
export type { SlCancelEvent } from '../../../src/events/events';
export type { SlFinishEvent } from '../../../src/events/events';
export type { SlStartEvent } from '../../../src/events/events';

const tagName = 'sl-animation';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlCancel: 'sl-cancel' as EventName<SlCancelEvent>,
    onSlFinish: 'sl-finish' as EventName<SlFinishEvent>,
    onSlStart: 'sl-start' as EventName<SlStartEvent>
  },
  displayName: 'SlAnimation'
});

/**
 * @summary Animate elements declaratively with nearly 100 baked-in presets, or roll your own with custom keyframes. Powered by the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).
 * @documentation https://shoelace.style/components/animation
 * @status stable
 * @since 2.0
 *
 * @event sl-cancel - Emitted when the animation is canceled.
 * @event sl-finish - Emitted when the animation finishes.
 * @event sl-start - Emitted when the animation starts or restarts.
 *
 * @slot - The element to animate. Avoid slotting in more than one element, as subsequent ones will be ignored. To
 *  animate multiple elements, either wrap them in a single container or use multiple `<sl-animation>` elements.
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
