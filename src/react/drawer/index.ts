import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/drawer/drawer.component.js';

import { type EventName } from '@lit-labs/react';
import type { SlShowEvent } from '../../../src/events/events';
import type { SlAfterShowEvent } from '../../../src/events/events';
import type { SlHideEvent } from '../../../src/events/events';
import type { SlAfterHideEvent } from '../../../src/events/events';
import type { SlInitialFocusEvent } from '../../../src/events/events';
import type { SlRequestCloseEvent } from '../../../src/events/events';
export type { SlShowEvent } from '../../../src/events/events';
export type { SlAfterShowEvent } from '../../../src/events/events';
export type { SlHideEvent } from '../../../src/events/events';
export type { SlAfterHideEvent } from '../../../src/events/events';
export type { SlInitialFocusEvent } from '../../../src/events/events';
export type { SlRequestCloseEvent } from '../../../src/events/events';

const tagName = 'sl-drawer';

const component = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlShow: 'sl-show' as EventName<SlShowEvent>,
    onSlAfterShow: 'sl-after-show' as EventName<SlAfterShowEvent>,
    onSlHide: 'sl-hide' as EventName<SlHideEvent>,
    onSlAfterHide: 'sl-after-hide' as EventName<SlAfterHideEvent>,
    onSlInitialFocus: 'sl-initial-focus' as EventName<SlInitialFocusEvent>,
    onSlRequestClose: 'sl-request-close' as EventName<SlRequestCloseEvent>
  },
  displayName: 'SlDrawer'
});

/**
 * @summary Drawers slide in from a container to expose additional options and information.
 * @documentation https://shoelace.style/components/drawer
 * @status stable
 * @since 2.0
 *
 * @dependency sl-icon-button
 *
 * @slot - The drawer's main content.
 * @slot label - The drawer's label. Alternatively, you can use the `label` attribute.
 * @slot header-actions - Optional actions to add to the header. Works best with `<sl-icon-button>`.
 * @slot footer - The drawer's footer, usually one or more buttons representing various options.
 *
 * @event sl-show - Emitted when the drawer opens.
 * @event sl-after-show - Emitted after the drawer opens and all animations are complete.
 * @event sl-hide - Emitted when the drawer closes.
 * @event sl-after-hide - Emitted after the drawer closes and all animations are complete.
 * @event sl-initial-focus - Emitted when the drawer opens and is ready to receive focus. Calling
 *   `event.preventDefault()` will prevent focusing and allow you to set it on a different element, such as an input.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} sl-request-close - Emitted when the user attempts to
 *   close the drawer by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the drawer open. Avoid using this unless closing the drawer will result in
 *   destructive behavior such as data loss.
 *
 * @csspart base - The component's base wrapper.
 * @csspart overlay - The overlay that covers the screen behind the drawer.
 * @csspart panel - The drawer's panel (where the drawer and its content are rendered).
 * @csspart header - The drawer's header. This element wraps the title and header actions.
 * @csspart header-actions - Optional actions to add to the header. Works best with `<sl-icon-button>`.
 * @csspart title - The drawer's title.
 * @csspart close-button - The close button, an `<sl-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart body - The drawer's body.
 * @csspart footer - The drawer's footer.
 *
 * @cssproperty --size - The preferred size of the drawer. This will be applied to the drawer's width or height
 *   depending on its `placement`. Note that the drawer will shrink to accommodate smaller screens.
 * @cssproperty --header-spacing - The amount of padding to use for the header.
 * @cssproperty --body-spacing - The amount of padding to use for the body.
 * @cssproperty --footer-spacing - The amount of padding to use for the footer.
 *
 * @animation drawer.showTop - The animation to use when showing a drawer with `top` placement.
 * @animation drawer.showEnd - The animation to use when showing a drawer with `end` placement.
 * @animation drawer.showBottom - The animation to use when showing a drawer with `bottom` placement.
 * @animation drawer.showStart - The animation to use when showing a drawer with `start` placement.
 * @animation drawer.hideTop - The animation to use when hiding a drawer with `top` placement.
 * @animation drawer.hideEnd - The animation to use when hiding a drawer with `end` placement.
 * @animation drawer.hideBottom - The animation to use when hiding a drawer with `bottom` placement.
 * @animation drawer.hideStart - The animation to use when hiding a drawer with `start` placement.
 * @animation drawer.denyClose - The animation to use when a request to close the drawer is denied.
 * @animation drawer.overlay.show - The animation to use when showing the drawer's overlay.
 * @animation drawer.overlay.hide - The animation to use when hiding the drawer's overlay.
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
