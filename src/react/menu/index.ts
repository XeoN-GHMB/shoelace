import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/menu/menu.js';

export default createComponent({
  tagName: 'sl-menu',
  elementClass: Component,
  react: React,
  events: {
    onSlSelect: 'sl-select'
  }
});
