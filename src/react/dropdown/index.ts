import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/dropdown/dropdown.js';

export default createComponent(React, 'sl-dropdown', Component, {
  onSlShow: 'sl-show',
  onSlAfterShow: 'sl-after-show',
  onSlHide: 'sl-hide',
  onSlAfterHide: 'sl-after-hide'
});
