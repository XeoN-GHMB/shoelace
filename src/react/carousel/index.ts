import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/carousel/carousel.js';

export default createComponent({
  tagName: 'sl-carousel',
  elementClass: Component,
  react: React,
  events: {
    onSlSlideChange: 'sl-slide-change'
  }
});
