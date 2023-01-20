import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/checkbox/checkbox.js';

export default createComponent({
  tagName: 'sl-checkbox',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlChange: 'sl-change',
    onSlFocus: 'sl-focus',
    onSlInput: 'sl-input'
  }
});
