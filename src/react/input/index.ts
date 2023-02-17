import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/input/input.js';

export default createComponent({
  tagName: 'sl-input',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlChange: 'sl-change',
    onSlClear: 'sl-clear',
    onSlFocus: 'sl-focus',
    onSlInput: 'sl-input',
    onSlInvalid: 'sl-invalid'
  }
});
