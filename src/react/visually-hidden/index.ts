import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/visually-hidden/visually-hidden.component.js';

const tagName = 'sl-visually-hidden';
Component.define('sl-visually-hidden');

/**
 * @summary The visually hidden utility makes content accessible to assistive devices without displaying it on the screen.
 * @documentation https://shoelace.style/components/visually-hidden
 * @status stable
 * @since 2.0
 *
 * @slot - The content to be visually hidden.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlVisuallyHidden'
});

export default reactWrapper;
