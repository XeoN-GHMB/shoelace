import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/rating/rating.js';

export default createComponent(React, 'sl-rating', Component, {
  onSlChange: 'sl-change'
});
