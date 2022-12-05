import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/router/router-link.js';

export default createComponent(React, 'sl-router-link', Component, {
  onSlRouterLinkBefore: 'sl-router-link-before'
});
