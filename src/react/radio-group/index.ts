import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio-group/radio-group.js';

export default createComponent(React, 'sl-radio-group', Component, {
  onSlChange: 'sl-change'
});
