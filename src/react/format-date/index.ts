import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/format-date/format-date.js';

export default createComponent({
  tagName: 'sl-format-date',
  elementClass: Component,
  react: React,
  events: {}
});
