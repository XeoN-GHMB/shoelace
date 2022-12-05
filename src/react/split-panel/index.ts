import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/split-panel/split-panel.js';

export default createComponent(React, 'sl-split-panel', Component, {
  onSlReposition: 'sl-reposition'
});
