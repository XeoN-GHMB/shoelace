import * as React from 'react';
import { createComponent } from '@lit/react';
import Component from '../../components/tree/tree.component.js';

import { type EventName } from '@lit/react';
import type { SlSelectionChangeEvent } from '../../events/events.js';
export type { SlSelectionChangeEvent } from '../../events/events.js';

const tagName = 'sl-tree';
Component.define('sl-tree');

/**
 * @summary Trees allow you to display a hierarchical list of selectable [tree items](/components/tree-item). Items with children can be expanded and collapsed as desired by the user.
 * @documentation https://shoelace.style/components/tree
 * @status stable
 * @since 2.0
 *
 * @event {{ selection: SlTreeItem[] }} sl-selection-change - Emitted when a tree item is selected or deselected.
 *
 * @slot - The default slot.
 * @slot expand-icon - The icon to show when the tree item is expanded. Works best with `<sl-icon>`.
 * @slot collapse-icon - The icon to show when the tree item is collapsed. Works best with `<sl-icon>`.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty [--indent-size=var(--sl-spacing-medium)] - The size of the indentation for nested items.
 * @cssproperty [--indent-guide-color=var(--sl-color-neutral-200)] - The color of the indentation line.
 * @cssproperty [--indent-guide-offset=0] - The amount of vertical spacing to leave between the top and bottom of the
 *  indentation line's starting position.
 * @cssproperty [--indent-guide-style=solid] - The style of the indentation line, e.g. solid, dotted, dashed.
 * @cssproperty [--indent-guide-width=0] - The width of the indentation line.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {
    onSlSelectionChange: 'sl-selection-change' as EventName<SlSelectionChangeEvent>
  },
  displayName: 'SlTree'
});

export default reactWrapper;
