import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/radio-group/radio-group';

export default createComponent(React, 'sl-radio-group', Component, {
  onSlChange: 'sl-change'
});
