import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/ripple/ripple.js';

export default createComponent(React, 'sl-ripple', Component, {
  onSlRippleEnd: 'sl-ripple-end'
});
