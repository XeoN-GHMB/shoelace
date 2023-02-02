import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/bone/bone.js';

export default createComponent({
  tagName: 'sl-bone',
  elementClass: Component,
  react: React,
  events: {
    onSlBoneChange: 'sl-bone-change',
    onSlBoneInit: 'sl-bone-init',
    onSlBoneRelationalSelect: 'sl-bone-relational-select'
  }
});
