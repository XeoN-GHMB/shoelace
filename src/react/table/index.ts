import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/table/table';

export default createComponent(React, 'sl-table', Component, {
  onSlEventName: 'sl-event-name'
});
