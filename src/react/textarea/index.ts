import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/textarea/textarea.js';

export default createComponent(React, 'sl-textarea', Component, {
  onSlChange: 'sl-change',
  onSlInput: 'sl-input',
  onSlFocus: 'sl-focus',
  onSlBlur: 'sl-blur'
});
