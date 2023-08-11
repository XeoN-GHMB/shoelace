import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/format-date/format-date.component.js';

const tagName = 'sl-format-date';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlFormatDate'
});

/**
 * @summary Formats a date/time using the specified locale and options.
 * @documentation https://shoelace.style/components/format-date
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
