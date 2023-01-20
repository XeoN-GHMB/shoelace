import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/mutation-observer/mutation-observer.js';

export default createComponent({
  tagName: 'sl-mutation-observer',
  elementClass: Component,
  react: React,
  events: {
    onSlMutation: 'sl-mutation'
  }
});
