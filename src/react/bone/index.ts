import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/bone/bone.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlBoneChangeEvent } from '../../../src/events/events';
import type { SlBoneInitEvent } from '../../../src/events/events';
import type { SlBoneRelationalSelectEvent } from '../../../src/events/events';
export type { SlBoneChangeEvent } from '../../../src/events/events';
export type { SlBoneInitEvent } from '../../../src/events/events';
export type { SlBoneRelationalSelectEvent } from '../../../src/events/events';

const tagName = 'sl-bone';
Component.define('sl-bone');

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @dependency sl-example
 *
 * @event sl-bone-change - Emitted when the bonevalues is change.
 * @event sl-bone-init - Emitted when the bonevalues is set or change the first time.
 * @event sl-bone-relational-select - If `inVi` is `true` we fire this event on relation selection.
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlBoneChange: 'sl-bone-change' as EventName<SlBoneChangeEvent>,
    onSlBoneInit: 'sl-bone-init' as EventName<SlBoneInitEvent>,
    onSlBoneRelationalSelect: 'sl-bone-relational-select' as EventName<SlBoneRelationalSelectEvent>
  },
  displayName: 'SlBone'
});

export default reactWrapper;
