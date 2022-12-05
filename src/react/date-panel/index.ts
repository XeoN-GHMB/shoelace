import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/date-panel/date-panel.js';

export default createComponent(React, 'sl-date-panel', Component, {
  onSlDateSelect: 'sl-date-select'
});
