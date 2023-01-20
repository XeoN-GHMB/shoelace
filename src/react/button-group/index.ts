import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/button-group/button-group.js';

export default createComponent({
  tagName: 'sl-button-group',
  elementClass: Component,
  react: React,
  events: {}
});
