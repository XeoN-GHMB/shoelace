import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/relative-time/relative-time.js';

export default createComponent({
  tagName: 'sl-relative-time',
  elementClass: Component,
  react: React,
  events: {}
});
