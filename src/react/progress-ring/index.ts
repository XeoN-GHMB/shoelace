import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/progress-ring/progress-ring.js';

export default createComponent({
  tagName: 'sl-progress-ring',
  elementClass: Component,
  react: React,
  events: {}
});
