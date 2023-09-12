import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/details-group/details-group.component.js';

const tagName = 'sl-details-group';
Component.define('sl-details-group');

/**
 * @since 2.0
 * @status stable
 * @viur 0.5
 *
 * @slot - The default slot.
 *
 * @cssproperty --details-gap - The gap between the detail boxes.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlDetailsGroup'
});

export default reactWrapper;
