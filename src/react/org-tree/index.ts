import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/org-tree/org-tree.js';

export default createComponent({
  tagName: 'sl-org-tree',
  elementClass: Component,
  react: React,
  events: {
    onSlOrgTreeNodeClick: 'sl-org-tree-node-click',
    onSlOrgTreeNodeToogle: 'sl-org-tree-node-toogle'
  }
});
