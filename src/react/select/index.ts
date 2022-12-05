import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/select/select.js';

export default createComponent(React, 'sl-select', Component, {
  onSlClear: 'sl-clear',
  onSlChange: 'sl-change',
  onSlInput: 'sl-input',
  onSlFocus: 'sl-focus',
  onSlBlur: 'sl-blur'
});
