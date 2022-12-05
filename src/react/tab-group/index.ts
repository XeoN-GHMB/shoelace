import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/tab-group/tab-group.js';

export default createComponent(React, 'sl-tab-group', Component, {
  onSlTabShow: 'sl-tab-show',
  onSlTabHide: 'sl-tab-hide'
});
