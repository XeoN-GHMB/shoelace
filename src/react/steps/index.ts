import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/steps/steps.js';

export default createComponent({
  tagName: 'sl-steps',
  elementClass: Component,
  react: React,
  events: {
    onSlChange: 'sl-change'
  }
});
