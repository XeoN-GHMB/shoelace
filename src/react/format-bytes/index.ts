import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/format-bytes/format-bytes.js';

export default createComponent({
  tagName: 'sl-format-bytes',
  elementClass: Component,
  react: React,
  events: {}
});
