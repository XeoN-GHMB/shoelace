import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/skeleton/skeleton.js';

export default createComponent({
  tagName: 'sl-skeleton',
  elementClass: Component,
  react: React,
  events: {}
});
