import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/org-node/org-node.component.js';

import { type EventName } from '@lit-labs/react';
import { SlNodeClickEvent } from '../../../src/events/events';
import { SlNodeToggleEvent } from '../../../src/events/events';
import { SlNodeBeforeToggleEvent } from '../../../src/events/events';

const tagName = 'sl-org-node';

const component = createComponent({
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
