import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/breadcrumb-item/breadcrumb-item.js';

export default createComponent({
  tagName: 'sl-breadcrumb-item',
  elementClass: Component,
  react: React,
  events: {}
});
