import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/avatar/avatar.js';

export default createComponent({
  tagName: 'sl-avatar',
  elementClass: Component,
  react: React,
  events: {}
});
