import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/color-picker/color-picker.js';

export default createComponent({
  tagName: 'sl-color-picker',
  elementClass: Component,
  react: React,
  events: {
    onSlBlur: 'sl-blur',
    onSlChange: 'sl-change',
    onSlFocus: 'sl-focus',
    onSlInput: 'sl-input',
    onSlInvalid: 'sl-invalid'
  }
});
