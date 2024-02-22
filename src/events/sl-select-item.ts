import type SlTreeItem from '../components/tree-item/tree-item.js';

export type SlSelectItemEvent = CustomEvent<{ name: String, value: String, icon: String, library: String,  path: SlTreeItem[] }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-select-item': SlSelectItemEvent;
  }
}
