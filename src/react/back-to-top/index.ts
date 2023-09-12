import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/back-to-top/back-to-top.component.js';

const tagName = 'sl-back-to-top';
Component.define('sl-back-to-top');

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @slot - The default slot.
 *
 * @csspart wrapper - The component's base wrapper.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlBackToTop'
});

export default reactWrapper;
