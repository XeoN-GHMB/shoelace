import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/alert/alert.js';

export default createComponent(React, 'sl-alert', Component, {
  onSlShow: 'sl-show',
  onSlAfterShow: 'sl-after-show',
  onSlHide: 'sl-hide',
  onSlAfterHide: 'sl-after-hide'
});
