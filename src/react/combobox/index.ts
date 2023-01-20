import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/combobox/combobox.js';

export default createComponent({
  tagName: 'sl-combobox',
  elementClass: Component,
  react: React,
  events: {
    onSlItemSelect: 'sl-item-select',
    onSlChange: 'sl-change',
    onSlInput: 'sl-input'
  }
});
