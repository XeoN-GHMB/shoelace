import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/icon-button/icon-button.js';

export default createComponent({
  tagName: 'sl-icon-button',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlFocus: 'sl-focus'
  }
});
