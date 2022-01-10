import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/steps/steps';

export default createComponent(React, 'sl-steps', Component, {
  onSlChange: 'sl-change'
});
