import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/progress-bar/progress-bar.component.js';

const tagName = 'sl-progress-bar';
Component.define('sl-progress-bar');

/**
 * @summary Progress bars are used to show the status of an ongoing operation.
 * @documentation https://shoelace.style/components/progress-bar
 * @status stable
 * @since 2.0
 *
 * @slot - A label to show inside the progress indicator.
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The progress bar's indicator.
 * @csspart label - The progress bar's label.
 *
 * @cssproperty --height - The progress bar's height.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --label-color - The color of the label.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlProgressBar'
});

export default reactWrapper;
