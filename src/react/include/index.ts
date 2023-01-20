import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/include/include.js';

export default createComponent({
  tagName: 'sl-include',
  elementClass: Component,
  react: React,
  events: {
    onSlLoad: 'sl-load',
    onSlError: 'sl-error'
  }
});
