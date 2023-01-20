import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/image-comparer/image-comparer.js';

export default createComponent({
  tagName: 'sl-image-comparer',
  elementClass: Component,
  react: React,
  events: {
    onSlChange: 'sl-change'
  }
});
