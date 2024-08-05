import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/avatar/avatar.component.js';

import { type EventName } from '@lit/react';
import type { SlErrorEvent } from '../../events/events.js';
export type { SlErrorEvent } from '../../events/events.js';

const tagName = 'sl-avatar';
Component.define('sl-avatar');

/**
 * @summary Avatars are used to represent a person or object.
 * @documentation https://shoelace.style/components/avatar
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 *
 * @event sl-error - The image could not be loaded. This may because of an invalid URL, a temporary network condition, or some
 * unknown cause.
 *
 * @slot icon - The default icon to use when no image or initials are present. Works best with `<sl-icon>`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the avatar's icon.
 * @csspart initials - The container that wraps the avatar's initials.
 * @csspart image - The avatar image. Only shown when the `image` attribute is set.
 *
 * @cssproperty --size - The size of the avatar.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlError: 'sl-error' as EventName<SlErrorEvent>
  },
  displayName: 'SlAvatar'
});

export default reactWrapper;
