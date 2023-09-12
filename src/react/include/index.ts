import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/include/include.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlLoadEvent } from '../../../src/events/events';
import type { SlErrorEvent } from '../../../src/events/events';
export type { SlLoadEvent } from '../../../src/events/events';
export type { SlErrorEvent } from '../../../src/events/events';

const tagName = 'sl-include';
Component.define('sl-include');

/**
 * @summary Includes give you the power to embed external HTML files into the page.
 * @documentation https://shoelace.style/components/include
 * @status stable
 * @since 2.0
 *
 * @event sl-load - Emitted when the included file is loaded.
 * @event {{ status: number }} sl-error - Emitted when the included file fails to load due to an error.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlLoad: 'sl-load' as EventName<SlLoadEvent>,
    onSlError: 'sl-error' as EventName<SlErrorEvent>
  },
  displayName: 'SlInclude'
});

export default reactWrapper;
