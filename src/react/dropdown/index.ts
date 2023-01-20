import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/dropdown/dropdown.js';

export default createComponent({
  tagName: 'sl-dropdown',
  elementClass: Component,
  react: React,
  events: {
    onSlShow: 'sl-show',
    onSlAfterShow: 'sl-after-show',
    onSlHide: 'sl-hide',
    onSlAfterHide: 'sl-after-hide'
  }
});
