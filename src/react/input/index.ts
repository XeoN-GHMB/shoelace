import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/input/input.js';

export default createComponent(React, 'sl-input', Component, {
  onSlChange: 'sl-change',
  onSlClear: 'sl-clear',
  onSlInput: 'sl-input',
  onSlFocus: 'sl-focus',
  onSlBlur: 'sl-blur'
});
