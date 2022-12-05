import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/include/include.js';

export default createComponent(React, 'sl-include', Component, {
  onSlLoad: 'sl-load',
  onSlError: 'sl-error'
});
