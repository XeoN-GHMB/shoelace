import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/mutation-observer/mutation-observer.component.js';

import { type EventName } from '@lit/react';
import type { SlMutationEvent } from '../../../src/events/events';
export type { SlMutationEvent } from '../../../src/events/events';

const tagName = 'sl-mutation-observer';
Component.define('sl-mutation-observer');

/**
 * @summary The Mutation Observer component offers a thin, declarative interface to the [`MutationObserver API`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).
 * @documentation https://shoelace.style/components/mutation-observer
 * @status stable
 * @since 2.0
 *
 * @event {{ mutationList: MutationRecord[] }} sl-mutation - Emitted when a mutation occurs.
 *
 * @slot - The content to watch for mutations.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlMutation: 'sl-mutation' as EventName<SlMutationEvent>
  },
  displayName: 'SlMutationObserver'
});

export default reactWrapper;
