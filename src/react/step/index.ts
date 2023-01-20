import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/step/step.js';

export default createComponent({
  tagName: 'sl-step',
  elementClass: Component,
  react: React,
  events: {
    onSlEventName: 'sl-event-name'
  }
});
