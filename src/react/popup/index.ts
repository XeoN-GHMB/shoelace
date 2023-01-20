import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/popup/popup.js';

export default createComponent({
  tagName: 'sl-popup',
  elementClass: Component,
  react: React,
  events: {
    onSlReposition: 'sl-reposition'
  }
});
