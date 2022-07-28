export function boneFormatter(cell: any, boneStructure: object, onRendered: any): any {

  let boneValue;
  if (typeof (cell.getValue()) === "object") {
    boneValue = JSON.parse(JSON.stringify(cell.getValue()));//DEEP Copy
  } else {
    boneValue = cell.getValue()
  }


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

function rawBoneRenderer(boneStructure: object, boneValue: any) {
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
      for (const index in boneValue) {

        boneValue[index] = formatstring(boneValue[index], boneStructure, null, index);
      }
      return `${boneValue.join("<br>")} `
    }
  }


  return formatstring(boneValue, boneStructure);
}

function stringBoneRenderer(boneStructure: object, boneValue: any): any {
  return rawBoneRenderer(boneStructure, boneValue)
}


function numericBoneRenderer(boneStructure: object, boneValue: any): any {
  return rawBoneRenderer(boneStructure, boneValue)
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
  console.log("render Record")
  console.log(boneStructure)
  console.log(boneValue)
  return rawBoneRenderer(boneStructure, boneValue)

}

function relationalBoneRenderer(boneStructure: any, boneValue: any) {

  if (boneStructure["multiple"] && boneValue !== null) {
    return boneValue.map((ele: any) => {
      return `${formatstring(ele, boneStructure)}<br>`
    }).join("<br>");


  } else {
    return `${formatstring(boneValue, boneStructure)}<br>`
  }
}

function selectBoneRenderer(boneStructure: any, boneValue: any) {

  if (boneStructure["multiple"] && boneValue !== null) {
    let tmpl = ``
    for (const tmpboneValue of boneValue) {
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

function formatstring(data, boneStructure, lang = null, index = null) {
  console.log("start format")
  console.log(index)
  console.log(data, boneStructure, lang, index)
  if (boneStructure["format"] === undefined) {
    return data;
  }

  if (Array.isArray(boneStructure["using"])) {
    let newUsing = {}
    for (const item of boneStructure["using"]) {

      newUsing[item[0]] = item[1]

    }
    boneStructure["using"] = newUsing;
  }
  let re = /\$\(([^)]+)\)/g;

  let format = boneStructure["format"]
  let text = boneStructure["format"]
  for (const match of format.matchAll(re)) {

    if (!boneStructure["languages"]) {
      if (boneStructure["multiple"]) {
        if (boneStructure["using"][match[1]]["type"] === "record") {
          if (boneStructure["using"][match[1]]["multiple"]) {
            console.log("multiple record in record")
          }

          const tmp = formatstring(getPath(data, match[1]), boneStructure["using"][match[1]])
          console.log("tmp is", tmp)
          text = text.replace(match[0], tmp)

        } else {
          console.log("data is ", data, match)
          console.log("path is", getPath(data, match[1]))
          text = text.replace(match[0], getPath(data, match[1]));
        }

      } else {

        if (boneStructure["using"][match[1]]["type"] === "record") {
          const tmp = formatstring(getPath(data, match[1]), boneStructure["using"][match[1]])
          console.log(tmp);
          text = text.replace(match[0], tmp)
        } else {
          text = text.replace(match[0], getPath(data, match[1]));
        }

      }

    } else {
      if (boneStructure["multiple"]) {
        text = text.replace(match[0], data[lang][index][match[1]]);
      } else {
        text = text.replace(match[0], data[lang][match[1]]);
      }
    }


  }

  return text


}

function getPath(obj, path) {

  path = typeof path === 'string' ? path.split('.') : path;
  let current = obj;
  while (path.length > 0) {
    let [head, ...tail] = path;
    path = tail;
    if (!Number.isNaN(parseInt(head))) {
      head = parseInt(head)
    }
    if (current[head] === undefined) {
      return undefined;
    }
    current = current[head];


  }

  return current;
}


function getTabs(boneStructure: any) {
  let tabs: string = ``;
  for (const lang of boneStructure["languages"]) {

    tabs += `<sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`;
  }
  return tabs
}

function getTabPannels(boneValue: any, boneStructure: any) {
  //We are when languages not null
  let tabpannels: string = ``;
  if (boneStructure["format"] === undefined) {
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
  } else {
    if (boneStructure["multiple"]) {
      for (const lang of boneStructure["languages"]) {
        for (const index in boneValue[lang]) {

          boneValue[lang][index] = formatstring(boneValue, boneStructure, lang, index);
        }


        tabpannels += `<sl-tab-panel name="${lang}">${boneValue[lang].join("<br>")}</sl-tab-panel>`;
      }
    } else {

      for (const lang of boneStructure["languages"]) {
        if (boneValue[lang] === null) {
          tabpannels += `<sl-tab-panel name="${lang}">-</sl-tab-panel>`;
        } else {
          tabpannels += `<sl-tab-panel name="${lang}">${formatstring(boneValue, boneStructure, lang)}</sl-tab-panel>`;
        }

      }
    }
  }

  return tabpannels;


}
