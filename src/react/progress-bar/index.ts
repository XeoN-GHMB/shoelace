import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/progress-bar/progress-bar.js';

export default createComponent({
  tagName: 'sl-progress-bar',
  elementClass: Component,
  react: React,
  events: {}
});
