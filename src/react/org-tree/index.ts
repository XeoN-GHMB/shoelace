import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/org-tree/org-tree.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlOrgTreeNodeClickEvent } from '../../../src/events/events';
import type { SlOrgTreeNodeToggleEvent } from '../../../src/events/events';
export type { SlOrgTreeNodeClickEvent } from '../../../src/events/events';
export type { SlOrgTreeNodeToggleEvent } from '../../../src/events/events';

const tagName = 'sl-org-tree';
Component.define('sl-org-tree');

/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 * @event {{ node: SlOrgNode,nodeData:OrgNodeDataType }} sl-org-tree-node-click  Emitted when node click.
 * @event {{ node: SlOrgNode,nodeData:OrgNodeDataType }} sl-org-tree-node-toggle Emitted when node toggle changed.
 *

 *
 * @csspart container - The component's container wrapper.
 * @csspart tree - The component's tree wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlOrgTreeNodeClick: 'sl-org-tree-node-click' as EventName<SlOrgTreeNodeClickEvent>,
    onSlOrgTreeNodeToggle: 'sl-org-tree-node-toggle' as EventName<SlOrgTreeNodeToggleEvent>
  },
  displayName: 'SlOrgTree'
});

export default reactWrapper;
