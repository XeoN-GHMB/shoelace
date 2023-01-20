import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/button/button.js';

export default createComponent({
  tagName: 'sl-button',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlFocus: 'sl-focus'
  }
});
