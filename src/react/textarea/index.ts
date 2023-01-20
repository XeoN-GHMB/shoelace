import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/textarea/textarea.js';

export default createComponent(React, 'sl-textarea', Component, {
  onSlBlur: 'sl-blur',
  onSlChange: 'sl-change',
  onSlFocus: 'sl-focus',
  onSlInput: 'sl-input'
});
