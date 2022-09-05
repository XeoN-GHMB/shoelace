export function boneFormatter(cell: any, boneStructure: object, onRendered: any): any {

  let boneValue;
  if (typeof (cell.getValue()) === "object") {
    boneValue = JSON.parse(JSON.stringify(cell.getValue()));//DEEP Copy
  } else {
    boneValue = cell.getValue();
  }

  const bone = document.createElement("sl-bone");
  bone.boneStructure=boneStructure;
  bone.boneValue=boneValue;
  bone.boneName=cell.getField();
  return bone;
}

