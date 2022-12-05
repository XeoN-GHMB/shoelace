import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/resize-observer/resize-observer.js';

export default createComponent(React, 'sl-resize-observer', Component, {
  onSlResize: 'sl-resize'
});
