import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/date-panel/date-panel.js';

export default createComponent({
  tagName: 'sl-date-panel',
  elementClass: Component,
  react: React,
  events: {
    onSlDateSelect: 'sl-date-select'
  }
});
