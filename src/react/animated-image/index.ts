import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/animated-image/animated-image.component.js';

import { type EventName } from '@lit-labs/react';
import { SlLoadEvent } from '../../../src/events/events';
import { SlErrorEvent } from '../../../src/events/events';

const tagName = 'sl-animated-image';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlLoad: 'sl-load' as EventName<SlLoadEvent>,
    onSlError: 'sl-error' as EventName<SlErrorEvent>
  },
  displayName: 'SlAnimatedImage'
});

/**
 * @summary A component for displaying animated GIFs and WEBPs that play and pause on interaction.
 * @documentation https://shoelace.style/components/animated-image
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 *
 * @event sl-load - Emitted when the image loads successfully.
 * @event sl-error - Emitted when the image fails to load.
 *
 * @slot play-icon - Optional play icon to use instead of the default. Works best with `<sl-icon>`.
 * @slot pause-icon - Optional pause icon to use instead of the default. Works best with `<sl-icon>`.
 *
 * @part - control-box - The container that surrounds the pause/play icons and provides their background.
 *
 * @cssproperty --control-box-size - The size of the icon box.
 * @cssproperty --icon-size - The size of the play/pause icons.
 */
class SlComponent extends React.Component<Parameters<typeof component>[0]> {
  constructor(...args: Parameters<typeof component>) {
    super(...args);
    Component.define(tagName);
  }

  render() {
    const { children, ...props } = this.props;
    return React.createElement(component, props, children);
  }
}

export default SlComponent;
