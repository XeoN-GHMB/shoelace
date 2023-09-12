import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/table-wrapper/table-wrapper.component.js';

const tagName = 'sl-table-wrapper';
Component.define('sl-table-wrapper');

/**
 * @since 2.0
 * @status stable
 * @viur 0.5
 *
 * @slot - The default slot.
 *
 * @csspart search - The search Field.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlTableWrapper'
});

export default reactWrapper;
