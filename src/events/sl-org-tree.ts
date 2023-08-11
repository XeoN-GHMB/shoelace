type SlOrgTreeNodeClickEvent = CustomEvent<Record<PropertyKey, never>>;
type SlOrgTreeNodeToggleEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-org-tree-node-click': SlOrgTreeNodeClickEvent;
    'sl-org-tree-node-toggle': SlOrgTreeNodeToggleEvent;
  }
}

export  {SlOrgTreeNodeClickEvent,SlOrgTreeNodeToggleEvent};