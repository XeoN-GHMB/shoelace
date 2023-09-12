import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/format-bytes/format-bytes.component.js';

const tagName = 'sl-format-bytes';
Component.define('sl-format-bytes');

/**
 * @summary Formats a number as a human readable bytes value.
 * @documentation https://shoelace.style/components/format-bytes
 * @status stable
 * @since 2.0
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlFormatBytes'
});

export default reactWrapper;
