import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/page-btn/page-btn.js';

export default createComponent(React, 'sl-page-btn', Component, {
  onSlPageChange: 'sl-page-change',
  onSlPageBeforeChange: 'sl-page-before-change'
});
