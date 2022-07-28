export function boneEditor(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, boneName = null, boneValue = null): any {
  console.log("start editor",boneName,boneValue)
  console.log("cell", cell._cell.column.field,cell.getValue())
  const rowHeight = cell.getElement().style.height;
  cell.getRow().getElement().style.height = "auto";
  cell.getElement().style.height = "auto"

  if (boneValue === null) {
    boneValue = cell.getValue()
  }
  if (boneName === null) {
    boneName = cell._cell.column.field;
  }
  if (boneStructure["languages"] !== null) {
    const tabGroup = document.createElement("sl-tab-group");
    for (const lang of boneStructure["languages"]) {
      //Create Tabs for Langs
      const tab = document.createElement("sl-tab")
      tab.slot = "nav"
      tab.panel = lang;
      tab.innerText = lang;
      tabGroup.appendChild(tab)
    }

    for (const lang of boneStructure["languages"]) {

      const tab_panel = document.createElement("sl-tab-panel")
      tab_panel.name = lang;
      if (boneStructure["multiple"]) {
        const inputWrapper = document.createElement("div");
        for (const [index, tmpValue] of boneValue[lang].entries()) {
          const newboneName = boneName + "." + lang + "." + index;

          const inputElement = getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, tmpValue, lang, newboneName);
          inputWrapper.appendChild(inputElement);
        }
        console.log(inputWrapper);
        tab_panel.appendChild(inputWrapper);

      } else {
        //Lang , no multipler
        const newboneName = boneName + "." + lang
        const inputElement = getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, boneValue[lang], lang, newboneName);

        tab_panel.appendChild(inputElement);
      }
      tabGroup.appendChild(tab_panel)


    }
    return tabGroup;

  } else {

    if (boneStructure["multiple"]) {
      //No Lang , Multiple
      const inputWrapper = document.createElement("div");
      inputWrapper.dataset.boneName = boneName;

      console.log("boneValue",boneValue)
      for (const [index, tmpValue] of boneValue.entries()) {
        const newboneName = boneStructure["type"] === "record" ? boneName + "." + index : boneName
        const inputElement = getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, tmpValue, null, newboneName);

        inputWrapper.appendChild(inputElement);
      }
      const addButton = document.createElement("sl-button");

      addButton.addEventListener("click", () => {
        const newboneName = boneName //FIXME RECORD BONE
        const inputElement = getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, "", null, newboneName);

        inputWrapper.insertBefore(inputElement, addButton);
        cell.getRow().getElement().style.height = "auto";
        cell.getElement().style.height = "auto"
      });
      addButton.innerText = "Add"
      inputWrapper.appendChild(addButton);


      return inputWrapper
    } else {
      //No Lang, No Multiple
      return getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, boneValue, null, boneName);


    }
  }


}

function getEditor(boneStructure: any) {
  switch (boneStructure["type"].split(".")[0]) {
    case "str":
      return stringBoneEditorRenderer
    case "numeric":
      return numericBoneEditorRenderer
    case "date":
      return dateBoneEditorRenderer
    case "bool":
      return booleanBoneEditorRenderer
    case "record":
      return recordBoneEditorRenderer
    default:
      return rawBoneEditorRenderer
  }
}

function rawBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value, lang = null, boneName = null) {
  const inputElement = document.createElement("sl-input");
  inputElement.dataset.boneName = boneName
  inputElement.value = value;
  if (lang !== null) {
    inputElement.dataset.lang = lang;
  }

  inputElement.addEventListener("keypress", (event) => {
    if (boneName === null) {
      boneName = cell._cell.column.field;
    }

    const skelKey = cell._cell.row.data.key;
    keyPress(event, success, cancel, boneName, boneStructure, skelKey, cell, successFunc)
  })
  return inputElement;
}


function stringBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = null) {

  return rawBoneEditorRenderer(cell, onRendered, success, cancel, boneStructure, value, lang, boneName)
}

function numericBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = null) {

  const numericBone = rawBoneEditorRenderer(cell, onRendered, success, cancel, boneStructure, value, lang, boneName);
  numericBone.type = "number"
  numericBone.min = boneStructure["min"];
  numericBone.max = boneStructure["max"];
  return numericBone;
}

function dateBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = null) {

  const dateBone = rawBoneEditorRenderer(cell, onRendered, success, cancel, boneStructure, value, lang, boneName);

  if (boneStructure["time"]) {

    dateBone.type = "datetime-local"
    dateBone.value = value.split('+')[0]
  } else {
    dateBone.type = "date"
    dateBone.value = (new Date(value)).toISOString().substr(0, 10);
  }


  return dateBone;
}

function booleanBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = null) {

  const inputElement = document.createElement("sl-switch");
  inputElement.dataset.boneName = boneName
  inputElement.value = value;
  if (lang !== null) {
    inputElement.dataset.lang = lang;
  }

  inputElement.addEventListener("keypress", (event) => {
    if (boneName === null) {
      boneName = cell._cell.column.field;
    }

    const skelKey = cell._cell.row.data.key;
    keyPress(event, success, cancel, boneName, boneStructure, skelKey, cell, successFunc)
  })
  return inputElement;
}

function recordBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = null) {
  console.log("start record")
  console.log(boneName)
  console.log(value)

  const inputWrapper = document.createElement("div");


  for (const bone of boneStructure["using"]) {
    const recordBoneName = bone[0];
    const recordBoneStructure = bone[1];

    const recordBoneValue = value[bone[0]];

    const newBoneName = boneName + "." + recordBoneName

    const tmp = boneEditor(cell, onRendered, success, cancel, recordBoneStructure, newBoneName, recordBoneValue)

    tmp.dataset.fromRecord = "true";


    inputWrapper.appendChild(tmp)
  }
  return inputWrapper;


}


function successFunc(inElement: HTMLElement, boneStructure: any, boneName: any, skelKey: any, success: any, cell: any) {


  const formData = new FormData();
  for (const child of cell.getElement().querySelectorAll("sl-input")) {
    formData.append(child.dataset.boneName, child.value);

  }
  var obj = {}
  for (const key of formData.keys()) {
    let value = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
    obj = createPath(obj, key, value)
  }

  updateData(formData, skelKey);
  success(obj[inElement.dataset.boneName.split(".")[0]])


}

function createPath(obj, path, value = null) {
  path = typeof path === 'string' ? path.split('.') : path;
  let current = obj;
  while (path.length > 1) {
    const [head, ...tail] = path;
    path = tail;

    if (current[head] === undefined) {
      if (Number.isNaN(parseInt(tail[0]))) {
        current[head] = {}
      } else {
        current[head] = []
      }
    }
    current = current[head];


  }


  if (Number.isNaN(parseInt(path[0]))) {
    current[path[0]] = value;
  } else {
    current[parseInt(path[0])] = value;
  }


  return obj;
}

function keyPress(event: KeyboardEvent, successFunc: any, cancelFunc: any, boneName, boneStructure, skelKey, cell, successFuncPorxy = successFunc) {

  if (event.key === "Enter") {

    successFuncPorxy(event.target, boneStructure, boneName, skelKey, successFunc, cell)
  }

  if (event.key === "Esc") {
    console.log("esc")
    cancelFunc()
  }
}

function addButtonClick(wrapper: any) {

  console.log(wrapper);
}

/////////////////HELPER FUNCTRIONS/////////////////

function updateData(formData, skelKey) {
  fetch("http://localhost:8080/json/skey").then(response => response.json()).then((skey) => {

    formData.append("key", skelKey)
    formData.append("skey", skey)


    fetch('http://localhost:8080/json/test/edit', {
      method: 'POST',
      body: formData
    })
  });
}
