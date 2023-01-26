import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/rating/rating.js';

export default createComponent({
  tagName: 'sl-rating',
  elementClass: Component,
  react: React,
  events: {
    onSlChange: 'sl-change',
    onSlHover: 'sl-hover'
  }
});
