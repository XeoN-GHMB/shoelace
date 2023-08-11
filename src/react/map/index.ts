import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/map/map.component.js';

const tagName = 'sl-map';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlMap'
});

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @slot - The default slot.
 * @slot example - add Poi in this slot.
 *
 * @csspart base - The component's map wrapper.
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
