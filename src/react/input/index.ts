import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/input/input.js';

export default createComponent(React, 'sl-input', Component, {
  onSlBlur: 'sl-blur',
  onSlChange: 'sl-change',
  onSlClear: 'sl-clear',
  onSlFocus: 'sl-focus',
  onSlInput: 'sl-input'
});
