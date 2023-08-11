type SlBoneChangeEvent = CustomEvent<Record<PropertyKey, never>>;
type SlBoneInitEvent = CustomEvent<Record<PropertyKey, never>>;
type SlBoneRelationalSelectEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-bone-change': SlBoneChangeEvent;
    'sl-bone-init': SlBoneInitEvent;
    'sl-bone-relational-select': SlBoneRelationalSelectEvent;
  }
}

export {SlBoneChangeEvent, SlBoneInitEvent, SlBoneRelationalSelectEvent}
