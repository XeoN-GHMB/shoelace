import SlPython from "./python";

export function addLogger(pyInstance, outputWrapper, instance:SlPython) {

  instance.unbindLogListener = instance.py.pyLogging.listen((val) => {

    for (const entry of val) {
      if (entry.done) {
        continue;
      }
      switch (entry.level) {
        case "info":
          const tmpElement = document.createElement("div")// todo styling andere element
          tmpElement.innerText = entry.text;
          console.log("append to ", outputWrapper)
          outputWrapper.appendChild(tmpElement);
          entry.done = true;
          break;
      }
    }

  })
}

export function removeLogger(instance:SlPython) {
  instance.unbindLogListener();

}

