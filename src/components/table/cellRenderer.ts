// @ts-nocheck
export function boneFormatter(cell: any, viewParams: object, onRendered: any): any {
  const boneStructure = viewParams[0];
  const tableInstance = viewParams[1];
  let boneValue;
  if (typeof (cell.getValue()) === "object") {
    boneValue = JSON.parse(JSON.stringify(cell.getValue()));//DEEP Copy
  } else {
    boneValue = cell.getValue();
  }


  if (tableInstance.mode === "hierarchy") {
    onRendered(() => {
      if (cell.getField() === cell.getTable().options.dataTreeElementColumn) {
        if (cell.getRow()._getSelf().modules.dataTree.children) {

          cell.getElement().classList.add("tabulator-root-cell-children")

        }
      }
    })


  }

  const bone = document.createElement("sl-bone");
  bone.boneStructure = boneStructure;
  bone.boneValue = boneValue;
  bone.boneName = cell.getField();
  return bone;
}

