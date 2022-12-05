import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/image-comparer/image-comparer.js';

export default createComponent(React, 'sl-image-comparer', Component, {
  onSlChange: 'sl-change'
});
