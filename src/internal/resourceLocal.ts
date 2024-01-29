import { ReactiveElement } from 'lit';
import { addEvent } from '../utilities/common.js';
import { resouce_changeEvent } from '../utilities/getResouce.js';

export default function resourceLocal() {
  return function (target: typeof ReactiveElement) {
    target.addInitializer((element: ReactiveElement) => {
      let result: {
        dispose: () => void;
      };
      element.addController({
        hostConnected() {
          result = addEvent(window, resouce_changeEvent, () => {
            element.requestUpdate();
          });
        },
        hostDisconnected() {
          result.dispose();
        }
      });
    });
  };
}
