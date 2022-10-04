import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tree/tree';

export default createComponent(React, 'sl-tree', Component, {
  onSlSelectionChange: 'sl-selection-change'
});
