import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/icon-button/icon-button';

export default createComponent(React, 'sl-icon-button', Component, {
  onSlBlur: 'sl-blur',
  onSlFocus: 'sl-focus'
});
