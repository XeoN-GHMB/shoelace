import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/breadcrumb/breadcrumb.js';

export default createComponent({
  tagName: 'sl-breadcrumb',
  elementClass: Component,
  react: React,
  events: {}
});
