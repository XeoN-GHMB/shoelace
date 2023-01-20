import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/ripple/ripple.js';

export default createComponent({
  tagName: 'sl-ripple',
  elementClass: Component,
  react: React,
  events: {
    onSlRippleEnd: 'sl-ripple-end'
  }
});
