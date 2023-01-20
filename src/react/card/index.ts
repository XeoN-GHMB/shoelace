import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/card/card.js';

export default createComponent({
  tagName: 'sl-card',
  elementClass: Component,
  react: React,
  events: {
    onSlChange: 'sl-change'
  }
});
