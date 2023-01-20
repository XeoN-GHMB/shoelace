import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/collapse/collapse.js';

export default createComponent({
  tagName: 'sl-collapse',
  elementClass: Component,
  react: React,
  events: {
    onSlBeforeTabChange: 'sl-before-tab-change',
    onSlTabChange: 'sl-tab-change'
  }
});
