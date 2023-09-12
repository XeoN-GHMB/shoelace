import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/map/map.component.js';

const tagName = 'sl-map';
Component.define('sl-map');

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
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlMap'
});

export default reactWrapper;
