import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio-group/radio-group.js';

export default createComponent({
  tagName: 'sl-radio-group',
  elementClass: Component,
  react: React,
  events: {
    onSlChange: 'sl-change',
    onSlInput: 'sl-input'
  }
});
