import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tab-panel/tab-panel.component.js';

const tagName = 'sl-tab-panel';
Component.define('sl-tab-panel');

/**
 * @summary Tab panels are used inside [tab groups](/components/tab-group) to display tabbed content.
 * @documentation https://shoelace.style/components/tab-panel
 * @status stable
 * @since 2.0
 *
 * @slot - The tab panel's content.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --padding - The tab panel's padding.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlTabPanel'
});

export default reactWrapper;
