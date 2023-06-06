import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/filter-checkbox/filter-checkbox.js';

export default createComponent({
  tagName: 'sl-filter-checkbox',
  elementClass: Component,
  react: React,
  events: {
    onSlEventName: 'sl-event-name'
  }
});
