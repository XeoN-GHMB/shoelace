import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/range/range.js';

export default createComponent(React, 'sl-range', Component, {
  onSlBlur: 'sl-blur',
  onSlChange: 'sl-change',
  onSlFocus: 'sl-focus',
  onSlInput: 'sl-input'
});
