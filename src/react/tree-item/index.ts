import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tree-item/tree-item';

export default createComponent(React, 'sl-tree-item', Component, {
  onSlExpand: 'sl-expand',
  onSlAfterExpand: 'sl-after-expand',
  onSlCollapse: 'sl-collapse',
  onSlAfterCollapse: 'sl-after-collapse',
  onSlLazyLoad: 'sl-lazy-load'
});
