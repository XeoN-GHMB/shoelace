import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/format-date/format-date.component.js';

const tagName = 'sl-format-date';
Component.define('sl-format-date');

/**
 * @summary Formats a date/time using the specified locale and options.
 * @documentation https://shoelace.style/components/format-date
 * @status stable
 * @since 2.0
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlFormatDate'
});

export default reactWrapper;
