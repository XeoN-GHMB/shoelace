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

  const rowHeight = cell.getElement().style.height;
  console.log(rowHeight)
  cell.getRow().getElement().style.height = "auto";
  cell.getElement().style.height = "auto";
  if (boneStructure["languages"] !== null) {
    const tabGroup = document.createElement("sl-tab-group");
    for (const lang of boneStructure["languages"]) {
      //  tabs += `<sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`;
      const tab = document.createElement("sl-tab")
      tab.slot = "nav"
      tab.panel = lang;
      tab.innerText = lang;
      tabGroup.appendChild(tab)
    }

    for (const lang of boneStructure["languages"]) {

      //  <sl-tab-panel name="${lang}">-</sl-tab-panel>
      const tab_panel = document.createElement("sl-tab-panel")
      tab_panel.name = lang;
      if (boneStructure["multiple"]) {
        const inputWrapper = document.createElement("div");
        for (const tmpValue of cell.getValue()[lang]) {
          console.log(tmpValue)
          const inputElement = document.createElement("sl-input");
          inputElement.value = tmpValue;
          inputElement.dataset.lang = lang;
          inputElement.addEventListener("keypress", keyPress);
          inputWrapper.appendChild(inputElement);
        }
        console.log(inputWrapper);
        tab_panel.appendChild(inputWrapper);

      } else {
        const inputElement = document.createElement("sl-input");
        inputElement.value = cell.getValue()[lang];
        inputElement.addEventListener("keypress", keyPress)
        inputElement.dataset.lang = lang;
        tab_panel.appendChild(inputElement);
      }
      tabGroup.appendChild(tab_panel)


    }
    return tabGroup;

  } else {

    if (boneStructure["multiple"]) {
      const inputWrapper = document.createElement("div");
      for (const tmpValue of cell.getValue()) {
        const inputElement = document.createElement("sl-input");
        inputElement.value = tmpValue;
        inputElement.addEventListener("keypress", keyPress);
        inputWrapper.appendChild(inputElement);
      }
      const addButton = document.createElement("sl-button");

        addButton.addEventListener("click", addButtonClick);
        addButton.innerText="Add"
        inputWrapper.appendChild(addButton);

      return inputWrapper
    } else {
      const inputElement = document.createElement("sl-input");
      inputElement.value = cell.getValue();
      inputElement.addEventListener("keypress", keyPress)
      return inputElement
    }
  }


  function successFunc(inElement: HTMLElement) {

    cell.getElement().style.height = rowHeight;
    if (boneStructure["languages"] !== null) {
      if (boneStructure["multiple"]) {
        let newBoneData = {}
        for (const child of cell.getElement().querySelectorAll("sl-input")) {
          console.log(child)
          if (newBoneData[child.dataset.lang] === undefined) {
            newBoneData[child.dataset.lang] = [child.value];
          } else {
            newBoneData[child.dataset.lang].push(child.value);
          }
        }
        console.log(newBoneData)
        updateData(boneName, newBoneData, skelKey, true, true);
        success(newBoneData);
      } else {
        let newBoneData = {}
        for (const child of cell.getElement().querySelectorAll("sl-input")) {
          console.log(child)
          newBoneData[child.dataset.lang] = child.value

        }

        updateData(boneName, newBoneData, skelKey, false, true);
        success(newBoneData);
      }
    } else {
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
  function addButtonClick(event:MouseEvent)
  {

  }


}

/////////////////HELPER FUNCTRIONS/////////////////
function updateData(boneName, boneValue, skelKey, multiple: boolean = false, lang = false) {
  fetch("http://localhost:8080/json/skey").then(response => response.json()).then((skey) => {
    const formData = new FormData();
    formData.append("key", skelKey)
    formData.append("skey", skey)
    if (lang) {
      if (multiple) {
        for (const key in boneValue) {
          for (const langValue of boneValue[key]) {
            console.log("append")
            console.log(langValue)
            formData.append(boneName + "." + key, langValue);
          }
        }
      } else {
        for (const key in boneValue) {
          formData.append(boneName + "." + key, boneValue[key]);
        }
      }
    } else {
      if (multiple) {
        for (const value of boneValue) {
          formData.append(boneName, value);
        }
      } else {
        formData.append(boneName, boneValue);
      }
    }


    fetch('http://localhost:8080/json/test/edit', {
      method: 'POST',
      body: formData
    })
  });
}
