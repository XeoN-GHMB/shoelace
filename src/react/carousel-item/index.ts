import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/carousel-item/carousel-item.component.js';

const tagName = 'sl-carousel-item';
Component.define('sl-carousel-item');

/**
 * @summary A carousel item represent a slide within a [carousel](/components/carousel).
 *
 * @since 2.0
 * @status experimental
 *
 * @slot - The carousel item's content..
 *
 * @cssproperty --aspect-ratio - The slide's aspect ratio. Inherited from the carousel by default.
 *
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlCarouselItem'
});

export default reactWrapper;
