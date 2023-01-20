import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/drawer/drawer.js';

export default createComponent({
  tagName: 'sl-drawer',
  elementClass: Component,
  react: React,
  events: {
    onSlShow: 'sl-show',
    onSlAfterShow: 'sl-after-show',
    onSlHide: 'sl-hide',
    onSlAfterHide: 'sl-after-hide',
    onSlInitialFocus: 'sl-initial-focus',
    onSlRequestClose: 'sl-request-close'
  }
});
