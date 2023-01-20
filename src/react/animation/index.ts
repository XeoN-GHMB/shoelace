import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/animation/animation.js';

export default createComponent({
  tagName: 'sl-animation',
  elementClass: Component,
  react: React,
  events: {
    onSlCancel: 'sl-cancel',
    onSlFinish: 'sl-finish',
    onSlStart: 'sl-start'
  }
});
