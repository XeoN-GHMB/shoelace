import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/menu-label/menu-label.component.js';

const tagName = 'sl-menu-label';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlMenuLabel'
});

/**
 * @summary Menu labels are used to describe a group of menu items.
 * @documentation https://shoelace.style/components/menu-label
 * @status stable
 * @since 2.0
 *
 * @slot - The menu label's content.
 *
 * @csspart base - The component's base wrapper.
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
