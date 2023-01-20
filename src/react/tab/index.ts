import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tab/tab.js';

export default createComponent({
  tagName: 'sl-tab',
  elementClass: Component,
  react: React,
  events: {
    onSlClose: 'sl-close'
  }
});
