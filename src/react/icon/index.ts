import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/icon/icon.js';

export default createComponent(React, 'sl-icon', Component, {
  onSlLoad: 'sl-load',
  onSlError: 'sl-error'
});
