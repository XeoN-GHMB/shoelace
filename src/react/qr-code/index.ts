import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/qr-code/qr-code.js';

export default createComponent({
  tagName: 'sl-qr-code',
  elementClass: Component,
  react: React,
  events: {}
});
