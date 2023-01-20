import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/badge/badge.js';

export default createComponent({
  tagName: 'sl-badge',
  elementClass: Component,
  react: React,
  events: {}
});
