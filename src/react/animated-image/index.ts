import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/animated-image/animated-image.js';

export default createComponent({
  tagName: 'sl-animated-image',
  elementClass: Component,
  react: React,
  events: {
    onSlLoad: 'sl-load',
    onSlError: 'sl-error'
  }
});
