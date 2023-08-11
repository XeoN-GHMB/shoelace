import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/relative-time/relative-time.component.js';

const tagName = 'sl-relative-time';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlRelativeTime'
});

/**
 * @summary Outputs a localized time phrase relative to the current date and time.
 * @documentation https://shoelace.style/components/relative-time
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
