import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tag/tag.js';

export default createComponent({
  tagName: 'sl-tag',
  elementClass: Component,
  react: React,
  events: {
    onSlRemove: 'sl-remove'
  }
});
