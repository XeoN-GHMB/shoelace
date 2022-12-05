import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/collapse/collapse.js';

export default createComponent(React, 'sl-collapse', Component, {
  onSlBeforeTabChange: 'sl-before-tab-change',
  onSlTabChange: 'sl-tab-change'
});
