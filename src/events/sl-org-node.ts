type SlNodeClickEvent = CustomEvent<Record<PropertyKey, never>>;
type SlNodeToggleEvent = CustomEvent<Record<PropertyKey, never>>;
type SlNodeBeforeToggleEvent = CustomEvent<Record<PropertyKey, never>>;


declare global {
  interface GlobalEventHandlersEventMap {
    'sl-node-click': SlNodeClickEvent;
    'sl-node-toggle': SlNodeToggleEvent;
    'sl-node-before-toggle': SlNodeBeforeToggleEvent;
  }
}

export {SlNodeClickEvent,SlNodeToggleEvent,SlNodeBeforeToggleEvent};
