import {formatstring} from "../../../../deploy/vi-vue/src/utils/string";

export function boneFormatter(cell: any, boneStructure: object, onRendered: any): any {

  const boneValue: any = cell.getValue()
  switch (boneStructure["type"].split(".")[0]) {
    case "str":
      return stringBoneRenderer(boneStructure, boneValue)
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
  return ""
}

function stringBoneRenderer(boneStructure: object, boneValue: any): any {
  if (boneValue === null) {
    return "-";
  }
  if (boneStructure["languages"] !== null) {

    if (boneStructure["multiple"]) {
      return `
        <sl-tab-group>
          ${getTabs(boneStructure)}
          ${getTabPannels(boneValue, boneStructure)}
        </sl-tab-group>`;
    } else {
      return `
        <sl-tab-group>
          ${getTabs(boneStructure)}
          ${getTabPannels(boneValue, boneStructure)}
        </sl-tab-group>`;
    }
  } else {

    if (boneStructure["multiple"]) {

      return `${boneValue.join("<br>")} `
    }
  }


  return boneValue.toLocaleString();
}


function numericBoneRenderer(boneStructure: object, boneValue: any): any {
  if (boneStructure["multiple"]) {
    return `${boneValue.join("<br>")}`

  }
  return boneValue.toString()
}

function dateBoneRenderer(boneStructure: object, boneValue: any): any {
  if (boneStructure["multiple"]) {
    return `${boneValue.map((ele) => {
      return new Date(ele).toLocaleString()
    }).join("<br>")}`

  }
  return new Date(boneValue).toLocaleString();
}

function recordBoneRenderer(boneStructure: any, boneValue: any) {
  if (boneStructure["multiple"]) {
    console.log(boneValue)
    return boneValue.map((ele: any) => {
      return `${formatstring(ele, boneStructure["format"])}<br>`
    }).join("<br>");
  } else {
    return `${formatstring(boneValue, boneStructure["format"])}<br>`
  }
}

function relationalBoneRenderer(boneStructure: any, boneValue: any) {

  if (boneStructure["multiple"] && boneValue !== null) {
    return boneValue.map((ele: any) => {
      return `${formatstring(ele, boneStructure["format"])}<br>`
    }).join("<br>");


  } else {
    return `${formatstring(boneValue, boneStructure["format"])}<br>`
  }
}

function selectBoneRenderer(boneStructure: any, boneValue: any) {

  if (boneStructure["multiple"] && boneValue !== null) {
    let tmpl = ``
    for (const tmpboneValue of boneValue)
    {
      for (const value: any of boneStructure["values"]) {
      if (value[0] === tmpboneValue) {
        tmpl += `${value[1]}<br>`;
        continue;
      }
    }
    }

    return tmpl;

  } else {
    for (const value: any of boneStructure["values"]) {
      if (value[0] === boneValue) {
        return value[1]
      }
    }

  }
}

////////////HELPER FUNCTIONS////////////////
function formatstring(data: any, format: any) {
  if (data === null) {
    return null;
  }
  format = format.split(" ");
  var displayText: string = ""
  for (let expression of format) {

    if (!expression.startsWith("$")) {
      displayText += expression + " "
      continue
    }
    expression = expression.substr(2, expression.length - 3)

    var pathData = data;
    for (const path of expression.split(".")) {
      if (path === "dest") // Check if dest because when add whe dont have it
      {
        if ('dest' in pathData) {
          pathData = pathData[path]
        }

      } else {
        pathData = pathData[path]
      }


    }

    displayText += pathData + " "
  }
  return displayText;
}

function getTabs(boneStructure: any) {
  let tabs: string = ``;
  for (const lang of boneStructure["languages"]) {

    tabs += `<sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`;
  }
  return tabs
}

function getTabPannels(boneValue: any, boneStructure: any) {

  let tabpannels: string = ``;
  if (boneStructure["multiple"]) {
    for (const lang of boneStructure["languages"]) {
      tabpannels += `<sl-tab-panel name="${lang}">${boneValue[lang].join("<br>")}</sl-tab-panel>`;
    }
  } else {

    for (const lang of boneStructure["languages"]) {
      if (boneValue[lang] === null) {
        tabpannels += `<sl-tab-panel name="${lang}">-</sl-tab-panel>`;
      } else {
        tabpannels += `<sl-tab-panel name="${lang}">${boneValue[lang].toString()}</sl-tab-panel>`;
      }

    }
  }

  return tabpannels;


}
