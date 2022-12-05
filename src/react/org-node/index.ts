import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/org-node/org-node.js';

export default createComponent(React, 'sl-org-node', Component, {
  onSlNodeClick: 'sl-node-click',
  onSlNodeToogle: 'sl-node-toogle',
  onSlNodeBeforeToogle: 'sl-node-before-toogle'
});
