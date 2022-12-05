import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/table/table.js';

export default createComponent(React, 'sl-table', Component, {
  onSlSelectionChanged: 'sl-selectionChanged'
});
