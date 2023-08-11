import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/button-group/button-group.component.js';

const tagName = 'sl-button-group';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlButtonGroup'
});

/**
 * @summary Button groups can be used to group related buttons into sections.
 * @documentation https://shoelace.style/components/button-group
 * @status stable
 * @since 2.0
 *
 * @slot - One or more `<sl-button>` elements to display in the button group.
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
