import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/spinner/spinner.js';

export default createComponent({
  tagName: 'sl-spinner',
  elementClass: Component,
  react: React,
  events: {}
});
