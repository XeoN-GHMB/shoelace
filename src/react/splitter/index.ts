import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/splitter/splitter.js';

export default createComponent(React, 'sl-splitter', Component, {
  onSlSplitterChange: 'sl-splitter-change'
});
