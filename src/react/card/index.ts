import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/card/card';

export default createComponent(React, 'sl-card', Component, {
  onSlChange: 'sl-change'
});
