import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/carousel-item/carousel-item.js';

export default createComponent({
  tagName: 'sl-carousel-item',
  elementClass: Component,
  react: React,
  events: {}
});
