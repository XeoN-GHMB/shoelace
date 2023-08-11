import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/details/details.component.js';

import { type EventName } from '@lit-labs/react';
import { SlShowEvent } from '../../../src/events/events';
import { SlAfterShowEvent } from '../../../src/events/events';
import { SlHideEvent } from '../../../src/events/events';
import { SlAfterHideEvent } from '../../../src/events/events';

const tagName = 'sl-details';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlShow: 'sl-show' as EventName<SlShowEvent>,
    onSlAfterShow: 'sl-after-show' as EventName<SlAfterShowEvent>,
    onSlHide: 'sl-hide' as EventName<SlHideEvent>,
    onSlAfterHide: 'sl-after-hide' as EventName<SlAfterHideEvent>
  },
  displayName: 'SlDetails'
});

/**
 * @summary Details show a brief summary and expand to show additional content.
 * @documentation https://shoelace.style/components/details
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon
 *
 * @slot - The details' main content.
 * @slot summary - The details' summary. Alternatively, you can use the `summary` attribute.
 * @slot expand-icon - Optional expand icon to use instead of the default. Works best with `<sl-icon>`.
 * @slot collapse-icon - Optional collapse icon to use instead of the default. Works best with `<sl-icon>`.
 *
 * @event sl-show - Emitted when the details opens.
 * @event sl-after-show - Emitted after the details opens and all animations are complete.
 * @event sl-hide - Emitted when the details closes.
 * @event sl-after-hide - Emitted after the details closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart header - The header that wraps both the summary and the expand/collapse icon.
 * @csspart summary - The container that wraps the summary.
 * @csspart summary-icon - The container that wraps the expand/collapse icons.
 * @csspart content - The details content.
 *
 * @animation details.show - The animation to use when showing details. You can use `height: auto` with this animation.
 * @animation details.hide - The animation to use when hiding details. You can use `height: auto` with this animation.
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
