import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/router/router.js';

export default createComponent(React, 'sl-router', Component, {
  onHashRouterBefore: 'hash-router-before',
  onHashRouterAfter: 'hash-router-after',
  onHashPrevented: 'hash-prevented',
  onNotFound: 'not-found'
});
