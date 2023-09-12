import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/divider/divider.component.js';

const tagName = 'sl-divider';
Component.define('sl-divider');

/**
 * @summary Dividers are used to visually separate or group elements.
 * @documentation https://shoelace.style/components/divider
 * @status stable
 * @since 2.0
 *
 * @cssproperty --color - The color of the divider.
 * @cssproperty --width - The width of the divider.
 * @cssproperty --spacing - The spacing of the divider.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlDivider'
});

export default reactWrapper;
