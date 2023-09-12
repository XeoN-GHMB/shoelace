import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/format-number/format-number.component.js';

const tagName = 'sl-format-number';
Component.define('sl-format-number');

/**
 * @summary Formats a number using the specified locale and options.
 * @documentation https://shoelace.style/components/format-number
 * @status stable
 * @since 2.0
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlFormatNumber'
});

export default reactWrapper;
