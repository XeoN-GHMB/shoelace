import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/menu-label/menu-label.component.js';

const tagName = 'sl-menu-label';
Component.define('sl-menu-label');

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
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlMenuLabel'
});

export default reactWrapper;
