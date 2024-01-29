import { addEvent, onEvent } from './common.js';
export type Poniter = {
  x: number;
  y: number;
};
/**
 * 拖动容器封装
 * @param dragDiv  待拖动容器
 * @param callBack 回调 (changePos:Poniter,event:MouseEvent)
 */
export const dragHandler = (dragDiv: HTMLElement, callBack: (changePos: Poniter, event: MouseEvent) => void) => {
  let oldPointer: Poniter;
  let newPointer: Poniter;
  let documentMouseMove: {
    dispose: () => void;
  };
  let documentMouseUp: {
    dispose: () => void;
  };
  addEvent(dragDiv, 'mousedown', (event: MouseEvent) => {
    event = event;
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    oldPointer = {
      x: event.pageX,
      y: event.pageY
    };
    if (documentMouseUp) {
      documentMouseUp.dispose();
    }
    if (documentMouseMove) {
      documentMouseMove.dispose();
    }
    documentMouseMove = addEvent(document, 'mousemove', startDrag);
    documentMouseUp = addEvent(document, 'mouseup', releaseDrag);
  });
  const startDrag = (event: MouseEvent) => {
    event = event;
    if (event.preventDefault) {
      event.preventDefault();
    }
    newPointer = {
      x: event.pageX - oldPointer.x,
      y: event.pageY - oldPointer.y
    };
    callBack(newPointer, event);
    oldPointer = {
      x: event.pageX,
      y: event.pageY
    };
  };
  const releaseDrag = (event: MouseEvent) => {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (documentMouseUp) {
      documentMouseUp.dispose();
    }
    if (documentMouseMove) {
      documentMouseMove.dispose();
    }
  };
};

/**
 * 拖动容器封装
 * @param dragDiv  容器
 * @param selector  子选择器
 * @param callBack 回调 (changePos:Poniter,event:MouseEvent)
 */
export const dragOnHandler = (dragDiv: HTMLElement, selector: string, callBack: (changePos: Poniter, event: MouseEvent) => void, endBack?: (event: MouseEvent) => void) => {
  let oldPointer: Poniter;
  let newPointer: Poniter;
  let documentMouseMove: {
    dispose: () => void;
  };
  let documentMouseUp: {
    dispose: () => void;
  };
  let delegateTarget: any;
  const startDrag = (event: MouseEvent) => {
    (event as any).delegateTarget = delegateTarget;
    if (event.preventDefault) {
      event.preventDefault();
    }
    newPointer = {
      x: event.pageX - oldPointer.x,
      y: event.pageY - oldPointer.y
    };
    callBack(newPointer, event);
    oldPointer = {
      x: event.pageX,
      y: event.pageY
    };
  };
  const releaseDrag = (event: MouseEvent) => {
    (event as any).delegateTarget = delegateTarget;
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (documentMouseUp) {
      documentMouseUp.dispose();
    }
    if (documentMouseMove) {
      documentMouseMove.dispose();
    }
    if (endBack) {
      endBack(event);
    }
  };

  return onEvent(dragDiv, selector, 'mousedown', (event: MouseEvent) => {
    delegateTarget = (event as any).delegateTarget;
    if (event.preventDefault) {
      event.preventDefault();
    }
    oldPointer = {
      x: event.pageX,
      y: event.pageY
    };
    if (documentMouseUp) {
      documentMouseUp.dispose();
    }
    if (documentMouseMove) {
      documentMouseMove.dispose();
    }
    documentMouseMove = addEvent(document, 'mousemove', startDrag);
    documentMouseUp = addEvent(document, 'mouseup', releaseDrag);
  });
};
