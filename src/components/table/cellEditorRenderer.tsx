export function boneEditor(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any): any {

  console.log(boneStructure)
  const boneValue: any = cell.getValue()
  switch (boneStructure["type"].split(".")[0]) {
    case "str":
      return stringEditorBoneRenderer(cell, onRendered, success, cancel, boneStructure)
    case "numeric":
      return numericBoneRenderer(boneStructure, boneValue)
    case "date":
      return dateBoneRenderer(boneStructure, boneValue)
    case "record":
      return recordBoneRenderer(boneStructure, boneValue)
    case "relational":
      return relationalBoneRenderer(boneStructure, boneValue)
    case "select":
      return selectBoneRenderer(boneStructure, boneValue)
  }

}

function stringEditorBoneRenderer(cell: any, onRendered: any, success: any, cancel: any, boneStructure: any) {


  const boneName = cell._cell.column.field;
  const skelKey = cell._cell.row.data.key;
  const inputWrapper = document.createElement("div");
  if (boneStructure["multiple"]) {
    const inputWrapper = document.createElement("div");
    for (const tmpValue of cell.getValue()) {
      const inputElement = document.createElement("sl-input");
      inputElement.value = tmpValue;
      inputElement.addEventListener("keypress", keyPress);
      inputWrapper.appendChild(inputElement);
    }
    return inputWrapper
  } else {
    const inputElement = document.createElement("sl-input");
    inputElement.value = cell.getValue();
    inputElement.addEventListener("keypress", keyPress)
    return inputElement
  }


  function successFunc(inElement: HTMLElement) {
    if (boneStructure["multiple"]) {
      let newBoneData = []
      for (const child of inElement.parentElement.querySelectorAll("sl-input")) {
        newBoneData.push(child.value)
      }
      console.log(inElement.parentElement)
      updateData(boneName, newBoneData, skelKey, true);
      success(newBoneData);
    } else {
      updateData(boneName, inElement.value, skelKey);
      success(inElement.value);
    }

  }

  function keyPress(event: KeyboardEvent) {

    if (event.key === "Enter") {
      successFunc(event.target);
    }

    if (event.key === "Esc") {
      console.log("esx")
      cancel()
    }
  }


}

/////////////////HELPER FUNCTRIONS/////////////////
function updateData(boneName, boneValue, skelKey, multiple: boolean = false) {
  fetch("http://localhost:8080/json/skey").then(response => response.json()).then((skey) => {
    const formData = new FormData();
    formData.append("key", skelKey)
    formData.append("skey", skey)
    if (multiple) {
      for (const value of boneValue) {
        formData.append(boneName, value);
      }
    } else {
      formData.append(boneName, boneValue);
    }

    fetch('http://localhost:8080/json/test/edit', {
      method: 'POST',
      body: formData
    })
  });
}
