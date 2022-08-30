import {formatstring} from "./cellRenderer";


export function boneEditor(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, boneName = "", boneValue: any = null): any {

  cell.getRow().getElement().style.height = "auto";
  cell.getRow().getElement().style.overflow = "visible";

  cell.getElement().style.height = "auto"
  cell.getElement().style.overflow = "visible";

  if (boneValue === null) {
    boneValue = cell.getValue();
  }

  if (boneName.length === 0) {
    boneName = cell._cell.column.field;
  }
  if (boneStructure["languages"] !== null) {
    const tabGroup = document.createElement("sl-tab-group");
    for (const lang of boneStructure["languages"]) {
      //Create Tabs for Langs
      const tab = document.createElement("sl-tab");
      tab.slot = "nav";
      tab.panel = lang;
      tab.innerText = lang;
      tabGroup.appendChild(tab);
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
        const newboneName = boneName + "." + lang;
        const inputElement = getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, boneValue[lang], lang, newboneName);

        tab_panel.appendChild(inputElement);
      }
      tabGroup.appendChild(tab_panel);


    }
    return tabGroup;

  } else {

    if (boneStructure["multiple"] && boneStructure["type"] !== "select") {
      //No Lang , Multiple
      const inputWrapper = document.createElement("div");
      inputWrapper.dataset.boneName = boneName;


      for (const [index, tmpValue] of boneValue.entries()) {
        const newboneName = boneStructure["type"] === "record" ? boneName + "." + index : boneName;
        const inputElement = getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, tmpValue, null, newboneName);

        inputWrapper.appendChild(inputElement);
      }
      const addButton = document.createElement("sl-button");

      addButton.addEventListener("click", () => {
        const newboneName = boneName //FIXME RECORD BONE
        const inputElement = getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, "", null, newboneName);

        inputWrapper.insertBefore(inputElement, addButton);
        cell.getRow().getElement().style.height = "auto";
        cell.getElement().style.height = "auto";
      });
      addButton.innerText = "Add";
      inputWrapper.appendChild(addButton);


      return inputWrapper;
    } else {
      //No Lang, No Multiple
      return getEditor(boneStructure)(cell, onRendered, success, cancel, boneStructure, boneValue, null, boneName);


    }
  }


}

function getEditor(boneStructure: any): Function {
  switch (boneStructure["type"].split(".")[0]) {
    case "str":
      return stringBoneEditorRenderer;
    case "numeric":
      return numericBoneEditorRenderer;
    case "date":
      return dateBoneEditorRenderer;
    case "bool":
      return booleanBoneEditorRenderer;
    case "record":
      return recordBoneEditorRenderer;
    case "relational":
      if (boneStructure["type"].startsWith("relational.tree.leaf.file")) {
        return fileBoneEditorRenderer;
      }
      return relationBoneEditorRenderer;
    case "select":
      return selectBoneEditorRenderer;
    default:
      return rawBoneEditorRenderer;
  }
}

function rawBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value:any, lang = null, boneName = "") {
  const inputElement = document.createElement("sl-input");
  inputElement.dataset.boneName = boneName;
  inputElement.value = value;
  if (lang !== null) {
    inputElement.dataset.lang = lang;
  }

  inputElement.addEventListener("keypress", (event) => {
    if (boneName.length === 0) {
      boneName = cell._cell.column.field;
    }

    const skelKey = cell._cell.row.data.key;
    keyPress(event, success, cancel, boneName, boneStructure, skelKey, cell, successFunc);
  })
  return inputElement;
}


function stringBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {

  return rawBoneEditorRenderer(cell, onRendered, success, cancel, boneStructure, value, lang, boneName);
}

function numericBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {

  const numericBone = rawBoneEditorRenderer(cell, onRendered, success, cancel, boneStructure, value, lang, boneName);
  numericBone.type = "number";
  numericBone.min = boneStructure["min"];
  numericBone.max = boneStructure["max"];
  return numericBone;
}

function dateBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {

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

function booleanBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {

  const inputElement = document.createElement("sl-switch");
  inputElement.dataset.boneName = boneName;
  inputElement.value = value;
  if (lang !== null) {
    inputElement.dataset.lang = lang;
  }

  inputElement.addEventListener("keypress", (event) => {
    if (boneName.length === 0) {
      boneName = cell._cell.column.field;
    }

    const skelKey = cell._cell.row.data.key;
    keyPress(event, success, cancel, boneName, boneStructure, skelKey, cell, successFunc);
  })
  return inputElement;
}

function recordBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {


  const inputWrapper = document.createElement("div");


  for (const bone of boneStructure["using"]) {
    const recordBoneName = bone[0];
    const recordBoneStructure = bone[1];
    const recordBoneValue = value[bone[0]];

    const newBoneName = boneName + "." + recordBoneName;

    const tmp = boneEditor(cell, onRendered, success, cancel, recordBoneStructure, newBoneName, recordBoneValue);

    tmp.dataset.fromRecord = "true";


    inputWrapper.appendChild(tmp);
  }
  return inputWrapper;


}

function relationBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {
  cell._cell.table.element.style.overflow = "visible";
  cell._cell.table.rowManager.element.style.overflow = "visible";
  const inputWrapper = document.createElement("div");
  //inputWrapper.style.height = "200px";
  console.log("relationBoneEditorRenderer");
  const searchBox = document.createElement("sl-combobox");
  //searchBox.hoist =true
  const url = "http://localhost:8080/json/country/list?search={q}";


  //searchBox.style.width = "100%";
  //searchBox.style.boxSizing = "border-box";
  searchBox.dataset.boneName = boneName;
  console.log(value);
  searchBox.dataset.boneValue = value["dest"]["key"];

  searchBox.source = (search) => {
    return fetch(url.replace('{q}', search))
      .then(res => res.json())
      .then((data) => {

          const skellist = data["skellist"]
          return skellist.map((d:any) => {
            return {
              text: formatstring({dest: d}, boneStructure),
              value: d.key
            };

          })
        }
      );
  };
  inputWrapper.appendChild(searchBox);

  searchBox.addEventListener("sl-item-select", (e:CustomEvent) => {

    searchBox.dataset.boneValue = e.detail.item.__value;
    updateRelationalBone(searchBox, cell, success)
  });
  searchBox.addEventListener("sl-change", (e) => {
    console.log("e cahnge")
    console.log(e)
  });

  return inputWrapper;


}

function fileBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {
  console.log("filebone?=")
}

function selectBoneEditorRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any, value: any, lang = null, boneName = "") {
  console.log(cell._cell.table)
  //TODO Find a Better way
  cell._cell.table.element.style.overflow = "visible";
  cell._cell.table.rowManager.element.style.overflow = "visible";
  if (boneName.length === 0) {
    boneName = cell._cell.column.field;
  }

  const inputSelect = document.createElement("sl-select");

  inputSelect.style.width = "100%";
  inputSelect.style.boxSizing = "border-box";


  inputSelect.multiple = boneStructure["multiple"]
  inputSelect.dataset.boneName = boneName

  inputSelect.value = value;

  inputSelect.addEventListener("sl-change", (event) => {


    const skelKey = cell._cell.row.data.key;
    const formData = new FormData();


    for (const child of cell.getElement().querySelectorAll("sl-select")) {
      if (boneStructure["multiple"]) {
        child.value.forEach((val: any) => {
          formData.append(child.dataset.boneName, val);
        })

      } else {
        formData.append(child.dataset.boneName, child.value);
      }


    }
    var obj = {}
    for (const key of formData.keys()) {
      let value = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
      obj = createPath(obj, key, value)
    }

    updateData(formData, skelKey);
    success(obj[boneName.split(".")[0]])
    //keyPress(event, success, cancel, boneName, boneStructure, skelKey, cell, successFunc)
  })
  for (const value of boneStructure["values"]) {
    console.log(value);
    const option = document.createElement("sl-menu-item");
    option.value = value[0];
    option.innerText = value[1];
    inputSelect.appendChild(option);
  }
  return inputSelect;


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

function createPath(obj:any, path:any, value = null) {
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

function updateRelationalBone(searchBox, cell, success) {

  const skelKey = cell._cell.row.data.key;
  const formData = new FormData();
  for (const child of cell.getElement().querySelectorAll("sl-combobox")) {
    formData.append(child.dataset.boneName, child.dataset.boneValue);

  }
  var obj = {}
  for (const key of formData.keys()) {
    let value = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
    obj = createPath(obj, key, value)
  }

  updateData(formData, skelKey).then((newBoneData:any) => {
    success(newBoneData["values"][searchBox.dataset.boneName.split(".")[0]])
  });
}

/////////////////HELPER FUNCTRIONS/////////////////

function updateData(formData, skelKey) {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:8080/json/skey").then(response => response.json()).then((skey) => {

      formData.append("key", skelKey)
      formData.append("skey", skey)


      fetch('http://localhost:8080/json/test/edit', {
        method: 'POST',
        body: formData
      }).then(resp => resp.json().then(data => resolve(data)))
    });
  });
}
