import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/dropdown/dropdown.component.js';

import { type EventName } from '@lit-labs/react';
import { SlShowEvent } from '../../../src/events/events';
import { SlAfterShowEvent } from '../../../src/events/events';
import { SlHideEvent } from '../../../src/events/events';
import { SlAfterHideEvent } from '../../../src/events/events';

const tagName = 'sl-dropdown';

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
  displayName: 'SlDropdown'
});

/**
 * @summary Dropdowns expose additional content that "drops down" in a panel.
 * @documentation https://shoelace.style/components/dropdown
 * @status stable
 * @since 2.0
 *
 * @dependency sl-popup
 *
 * @slot - The dropdown's main content.
 * @slot trigger - The dropdown's trigger, usually a `<sl-button>` element.
 *
 * @event sl-show - Emitted when the dropdown opens.
 * @event sl-after-show - Emitted after the dropdown opens and all animations are complete.
 * @event sl-hide - Emitted when the dropdown closes.
 * @event sl-after-hide - Emitted after the dropdown closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart trigger - The container that wraps the trigger.
 * @csspart panel - The panel that gets shown when the dropdown is open.
 *
 * @animation dropdown.show - The animation to use when showing the dropdown.
 * @animation dropdown.hide - The animation to use when hiding the dropdown.
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
