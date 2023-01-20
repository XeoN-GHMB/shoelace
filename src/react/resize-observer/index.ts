import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/resize-observer/resize-observer.js';

export default createComponent({
  tagName: 'sl-resize-observer',
  elementClass: Component,
  react: React,
  events: {
    onSlResize: 'sl-resize'
  }
});
