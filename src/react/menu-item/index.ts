import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/menu-item/menu-item';

export default createComponent(React, 'sl-menu-item', Component, {
  onSlLabelChange: 'sl-label-change'
});
