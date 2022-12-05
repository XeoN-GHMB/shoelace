import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio-button/radio-button.js';

export default createComponent(React, 'sl-radio-button', Component, {
  onSlBlur: 'sl-blur',
  onSlFocus: 'sl-focus'
});
