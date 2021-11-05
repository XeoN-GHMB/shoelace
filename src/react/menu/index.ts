import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/menu/menu';

export default createComponent(React, 'sl-menu', Component, {
  onSlSelect: 'sl-select'
});
