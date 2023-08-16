import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/details-group/details-group.component.js';

const tagName = 'sl-details-group';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlDetailsGroup'
});

/**
 * @since 2.0
 * @status stable
 * @viur 0.5
 *
 * @slot - The default slot.
 *
 * @cssproperty --details-gap - The gap between the detail boxes.
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
