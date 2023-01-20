import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/splitter/splitter.js';

export default createComponent({
  tagName: 'sl-splitter',
  elementClass: Component,
  react: React,
  events: {
    onSlSplitterChange: 'sl-splitter-change'
  }
});
