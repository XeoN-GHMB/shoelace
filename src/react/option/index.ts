import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/option/option.js';

export default createComponent({
  tagName: 'sl-option',
  elementClass: Component,
  react: React,
  events: {}
});
