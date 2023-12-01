import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/org-node/org-node.component.js';

import { type EventName } from '@lit/react';
import type { SlNodeClickEvent } from '../../events/events';
import type { SlNodeToggleEvent } from '../../events/events';
import type { SlNodeBeforeToggleEvent } from '../../events/events';
export type { SlNodeClickEvent } from '../../events/events';
export type { SlNodeToggleEvent } from '../../events/events';
export type { SlNodeBeforeToggleEvent } from '../../events/events';

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
