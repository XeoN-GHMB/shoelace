import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/date/date.js';

export default createComponent({
  tagName: 'sl-date',
  elementClass: Component,
  react: React,
  events: {
    onSlDateChange: 'sl-date-change'
  }
});
