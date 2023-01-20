import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/visually-hidden/visually-hidden.js';

export default createComponent({
  tagName: 'sl-visually-hidden',
  elementClass: Component,
  react: React,
  events: {}
});
