import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/slider/slider.js';

export default createComponent({
  tagName: 'sl-slider',
  elementClass: Component,
  react: React,
  events: {}
});
