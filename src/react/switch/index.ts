import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/switch/switch.js';

export default createComponent(React, 'sl-switch', Component, {
  onSlBlur: 'sl-blur',
  onSlChange: 'sl-change',
  onSlFocus: 'sl-focus'
});
