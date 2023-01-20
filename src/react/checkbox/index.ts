import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/checkbox/checkbox.js';

export default createComponent(React, 'sl-checkbox', Component, {
  onSlBlur: 'sl-blur',
  onSlChange: 'sl-change',
  onSlFocus: 'sl-focus',
  onSlInput: 'sl-input'
});
