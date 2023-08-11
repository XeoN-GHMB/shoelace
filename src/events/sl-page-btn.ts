type SlPageChangeEvent = CustomEvent<Record<PropertyKey, never>>;
type SlPageBeforeChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-change': SlPageChangeEvent;
    'sl-page-before-change': SlPageBeforeChangeEvent;
  }
}

export {SlPageChangeEvent, SlPageBeforeChangeEvent};
