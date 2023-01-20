import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/split-panel/split-panel.js';

export default createComponent({
  tagName: 'sl-split-panel',
  elementClass: Component,
  react: React,
  events: {
    onSlReposition: 'sl-reposition'
  }
});
