import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/bone/bone';

export default createComponent(React, 'sl-bone', Component, {
  onSlEventName: 'sl-event-name'
});
