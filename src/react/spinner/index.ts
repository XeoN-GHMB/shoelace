import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/spinner/spinner.component.js';

const tagName = 'sl-spinner';
Component.define('sl-spinner');

/**
 * @summary Spinners are used to show the progress of an indeterminate operation.
 * @documentation https://shoelace.style/components/spinner
 * @status stable
 * @since 2.0
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the spinner's indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlSpinner'
});

export default reactWrapper;
