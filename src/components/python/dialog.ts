import SlPython from "./python";
import {Confirm} from "./interaction/confirm";
export function addDialogHandler(pyInstance, outputWrapper, instance:SlPython) {

  instance.unbindDialogListener = pyInstance.pyDialogs.listen((val) => {

    for (const entry of val) {
      if (entry.done) {
        continue;
      }
      console.log(" dialog entry", entry);
      switch (entry.type) {
        case "confirm":
          outputWrapper.appendChild((new Confirm(entry,pyInstance)).getElement());

          break;
      }

      entry.done = true;
    }


  });
}
export function removeDialogHandler(instance:SlPython) {
  instance.unbindDialogListener();

}
