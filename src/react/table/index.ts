import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/table/table.js';

export default createComponent({
  tagName: 'sl-table',
  elementClass: Component,
  react: React,
  events: {
    onSlSelectionChanged: 'sl-selectionChanged'
  }
});
