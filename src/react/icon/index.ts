import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/icon/icon.js';

export default createComponent({
  tagName: 'sl-icon',
  elementClass: Component,
  react: React,
  events: {
    onSlLoad: 'sl-load',
    onSlError: 'sl-error'
  }
});
