import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/router/router-link.js';

export default createComponent({
  tagName: 'sl-router-link',
  elementClass: Component,
  react: React,
  events: {
    onSlRouterLinkBefore: 'sl-router-link-before'
  }
});
