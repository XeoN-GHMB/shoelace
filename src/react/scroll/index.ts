import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/scroll/scroll.js';

export default createComponent(React, 'sl-scroll', Component, {
  onSlScrollY: 'sl-scroll-y',
  onSlScrollX: 'sl-scroll-x',
  onSlScrollYEnd: 'sl-scroll-y-end',
  onSlScrollXEnd: 'sl-scroll-x-end',
  onSlScrollChange: 'sl-scroll-change',
  onResize: 'resize'
});
