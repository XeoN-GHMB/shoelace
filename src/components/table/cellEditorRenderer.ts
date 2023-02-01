// @ts-nocheck
import SlBone from "../bone/bone";

export function boneEditor(cell: any, onRendered: any, success: any, cancel: any, editParams: any): any {
  console.log("render editor")
  const boneStructure = editParams[0];
  const tableInstance = editParams[1];

  cell.getRow().getElement().style.height = "auto";
  cell.getRow().getElement().style.overflow = "visible";

  cell.getElement().style.height = "auto"
  cell.getElement().style.overflow = "visible";

  const bone = document.createElement("sl-bone");
  bone.boneStructure = boneStructure;
  bone.boneValue = cell.getValue();
  bone.boneName = cell.getField();
  bone.renderType = "edit";
  bone.rendersaveButton = "true";
  bone.inTable = true;
  bone.inVi = tableInstance.inVi;

  bone.addEventListener("sl-boneChange", async (boneChangeEvent) => {

    const skelKey = cell._cell.row.data.key;
    if (boneChangeEvent.detail.type === "noChange") {
      console.log("no change")
      success(boneChangeEvent.detail.boneValue);
      cell.getRow()._row.clearCellHeight();
      return;
    }
    if (boneChangeEvent.detail.type === "fromSave") {


      const result: object = await updateData(boneChangeEvent.detail.formData, skelKey, tableInstance);
      if (result["action"] === "editSuccess") {
        if (boneChangeEvent.detail.type === "fromSave") {
          success(result["values"][cell.getField()])
          cell.getRow()._row.clearCellHeight();

        }

      } else {
        for (const error of result["errors"])
          if (error["fieldPath"][0] === cell.getField()) {
            bone.handleError(error);
          }

      }
    }


  })


  return bone;


}


function successFunc(cell: any, boneStructure: any, boneName: any, success: any, callSuccess = true) {

  const skelKey = cell._cell.row.data.key;
  const formData = new FormData();

  for (const child of cell.getElement().querySelectorAll("sl-input")) {
    if (boneStructure["multiple"] && boneStructure["languages"] !== null) {
      const tmpBoneName = child.dataset.boneName.split(".");
      formData.append(tmpBoneName.slice(0, tmpBoneName.length - 1).join("."), child.value);
    } else {
      formData.append(child.dataset.boneName, child.value);
    }


  }
  var obj = {}
  for (const key of formData.keys()) {
    let value = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key);

    if (boneStructure["multiple"] && boneStructure["languages"] === null) {
      if (!Array.isArray(value)) {
        const tmpvalue = [value];
        value = tmpvalue;
      }
    }
    obj = createPath(obj, key, value);
  }

  updateData(formData, skelKey);
  if (callSuccess) {
    success(obj[cell.getField()]);
    cell.getRow()._row.clearCellHeight();
  }


}

function createPath(obj: any, path: any, value = null) {
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

  updateData(formData, skelKey).then((newBoneData: any) => {
    success(newBoneData["values"][searchBox.dataset.boneName.split(".")[0]])
  });
}

/////////////////HELPER FUNCTRIONS/////////////////
function getSkey(apiUrl: string) {
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}/json/skey`).then(response => response.json()).then((skey) => {
      resolve(skey)
    })

  })
}

export function updateData(formData: FormData, skelKey: string, tableInstance: SlBone) {
  if (tableInstance.module === null) {
    throw "No Module provided"
  }

  return new Promise((resolve, reject) => {
    getSkey(tableInstance).then((skey: string) => {

      formData.append("key", skelKey)
      formData.append("skey", skey)


      fetch(`${tableInstance.apiUrl}/json/${tableInstance.module}/edit`, {
        method: 'POST',
        body: formData
      }).then(resp => resp.json().then(data => resolve(data)))
    });
  });
}
