import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/switch/switch.js';

export default createComponent({
  tagName: 'sl-switch',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlChange: 'sl-change',
    onSlInput: 'sl-input',
    onSlFocus: 'sl-focus'
  }
});
