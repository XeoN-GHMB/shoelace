import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/relative-time/relative-time.component.js';

const tagName = 'sl-relative-time';
Component.define('sl-relative-time');

/**
 * @summary Outputs a localized time phrase relative to the current date and time.
 * @documentation https://shoelace.style/components/relative-time
 * @status stable
 * @since 2.0
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlRelativeTime'
});

export default reactWrapper;
