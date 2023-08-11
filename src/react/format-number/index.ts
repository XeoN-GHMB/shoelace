import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/format-number/format-number.component.js';

const tagName = 'sl-format-number';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlFormatNumber'
});

/**
 * @summary Formats a number using the specified locale and options.
 * @documentation https://shoelace.style/components/format-number
 * @status stable
 * @since 2.0
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
