import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tree/tree.js';

export default createComponent({
  tagName: 'sl-tree',
  elementClass: Component,
  react: React,
  events: {
    onSlSelectionChange: 'sl-selection-change'
  }
});
