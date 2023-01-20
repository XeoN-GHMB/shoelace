import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio-button/radio-button.js';

export default createComponent({
  tagName: 'sl-radio-button',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlFocus: 'sl-focus'
  }
});
