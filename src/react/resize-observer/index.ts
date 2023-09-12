import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/resize-observer/resize-observer.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlResizeEvent } from '../../../src/events/events';
export type { SlResizeEvent } from '../../../src/events/events';

const tagName = 'sl-resize-observer';
Component.define('sl-resize-observer');

/**
 * @summary The Resize Observer component offers a thin, declarative interface to the [`ResizeObserver API`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).
 * @documentation https://shoelace.style/components/resize-observer
 * @status stable
 * @since 2.0
 *
 * @slot - One or more elements to watch for resizing.
 *
 * @event {{ entries: ResizeObserverEntry[] }} sl-resize - Emitted when the element is resized.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlResize: 'sl-resize' as EventName<SlResizeEvent>
  },
  displayName: 'SlResizeObserver'
});

export default reactWrapper;
