import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/org-node/org-node.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlNodeClickEvent } from '../../../src/events/events';
import type { SlNodeToggleEvent } from '../../../src/events/events';
import type { SlNodeBeforeToggleEvent } from '../../../src/events/events';
export type { SlNodeClickEvent } from '../../../src/events/events';
export type { SlNodeToggleEvent } from '../../../src/events/events';
export type { SlNodeBeforeToggleEvent } from '../../../src/events/events';

const tagName = 'sl-org-node';
Component.define('sl-org-node');

/**
 * @since 2.0
 * @status experimental
 *

 *  @event sl-node-click {data:any} - click node Data Element .
    @event sl-node-toggle {data:any} - toggle node Element .
    @event sl-node-before-toggle {data:any} -before toggle node Element .
 *

 *
 *  @cssproperty --example - An example CSS custom property.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlNodeClick: 'sl-node-click' as EventName<SlNodeClickEvent>,
    onSlNodeToggle: 'sl-node-toggle' as EventName<SlNodeToggleEvent>,
    onSlNodeBeforeToggle: 'sl-node-before-toggle' as EventName<SlNodeBeforeToggleEvent>
  },
  displayName: 'SlOrgNode'
});

export default reactWrapper;
