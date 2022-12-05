import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio/radio.js';

export default createComponent(React, 'sl-radio', Component, {
  onSlBlur: 'sl-blur',
  onSlFocus: 'sl-focus'
});
