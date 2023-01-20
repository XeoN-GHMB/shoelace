import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/layout/layout.js';

export default createComponent({
  tagName: 'sl-layout',
  elementClass: Component,
  react: React,
  events: {}
});
