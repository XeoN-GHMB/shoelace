import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tab-group/tab-group.js';

export default createComponent({
  tagName: 'sl-tab-group',
  elementClass: Component,
  react: React,
  events: {
    onSlTabShow: 'sl-tab-show',
    onSlTabHide: 'sl-tab-hide'
  }
});
