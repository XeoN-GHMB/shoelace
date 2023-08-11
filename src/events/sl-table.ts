type SlSelectionChangedEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-selection-changed': SlSelectionChangedEvent;
  }
}

export default SlSelectionChangedEvent;
