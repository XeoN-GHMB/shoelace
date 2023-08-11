import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/org-tree/org-tree.component.js';

import { type EventName } from '@lit-labs/react';
import { SlOrgTreeNodeClickEvent } from '../../../src/events/events';
import { SlOrgTreeNodeToggleEvent } from '../../../src/events/events';

const tagName = 'sl-org-tree';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlOrgTreeNodeClick: 'sl-org-tree-node-click' as EventName<SlOrgTreeNodeClickEvent>,
    onSlOrgTreeNodeToggle: 'sl-org-tree-node-toggle' as EventName<SlOrgTreeNodeToggleEvent>
  },
  displayName: 'SlOrgTree'
});

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
