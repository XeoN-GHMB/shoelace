import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/popup/popup.js';

export default createComponent(React, 'sl-popup', Component, {
  onSlReposition: 'sl-reposition'
});
