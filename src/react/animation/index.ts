import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/animation/animation.js';

export default createComponent(React, 'sl-animation', Component, {
  onSlCancel: 'sl-cancel',
  onSlFinish: 'sl-finish',
  onSlStart: 'sl-start'
});
