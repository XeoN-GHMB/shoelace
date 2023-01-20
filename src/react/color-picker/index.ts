import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/color-picker/color-picker.js';

export default createComponent({
  tagName: 'sl-color-picker',
  elementClass: Component,
  react: React,
  events: {
    onSlChange: 'sl-change',
    onSlInput: 'sl-input'
  }
});
