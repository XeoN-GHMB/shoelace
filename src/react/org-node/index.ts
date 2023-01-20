import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/org-node/org-node.js';

export default createComponent({
  tagName: 'sl-org-node',
  elementClass: Component,
  react: React,
  events: {
    onSlNodeClick: 'sl-node-click',
    onSlNodeToogle: 'sl-node-toogle',
    onSlNodeBeforeToogle: 'sl-node-before-toogle'
  }
});
