import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/badge/badge.component.js';

const tagName = 'sl-badge';
Component.define('sl-badge');

/**
 * @summary Badges are used to draw attention and display statuses or counts.
 * @documentation https://shoelace.style/components/badge
 * @status stable
 * @since 2.0
 *
 * @slot - The badge's content.
 *
 * @csspart base - The component's base wrapper.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlBadge'
});

export default reactWrapper;
