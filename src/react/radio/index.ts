import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio/radio.js';

export default createComponent({
  tagName: 'sl-radio',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlFocus: 'sl-focus'
  }
});
