import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/color-picker/color-picker.js';

export default createComponent(React, 'sl-color-picker', Component, {
  onSlChange: 'sl-change',
  onSlInput: 'sl-input'
});
