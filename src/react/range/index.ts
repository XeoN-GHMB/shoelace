import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/range/range.js';

export default createComponent(React, 'sl-range', Component, {
  onSlChange: 'sl-change',
  onSlBlur: 'sl-blur',
  onSlFocus: 'sl-focus'
});
