import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/page-btn/page-btn.js';

export default createComponent({
  tagName: 'sl-page-btn',
  elementClass: Component,
  react: React,
  events: {
    onSlPageChange: 'sl-page-change',
    onSlPageBeforeChange: 'sl-page-before-change'
  }
});
