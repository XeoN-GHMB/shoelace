import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/router/router.js';

export default createComponent({
  tagName: 'sl-router',
  elementClass: Component,
  react: React,
  events: {
    onHashRouterBefore: 'hash-router-before',
    onHashRouterAfter: 'hash-router-after',
    onHashPrevented: 'hash-prevented',
    onNotFound: 'not-found'
  }
});
