import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/table-wrapper/table-wrapper.component.js';

const tagName = 'sl-table-wrapper';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlTableWrapper'
});

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @slot - The default slot.
 *
 * @csspart search - The search Field.
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
