export function boneFormatter(cell: any, boneStructure: object, onRendered: any): any {

  let boneValue;
  if (typeof (cell.getValue()) === "object") {
    boneValue = JSON.parse(JSON.stringify(cell.getValue()));//DEEP Copy
  } else {
    boneValue = cell.getValue();
  }


  switch (boneStructure["type"].split(".")[0]) {
    case "str":
      return stringBoneRenderer(boneStructure, boneValue);
    case "numeric":
      return numericBoneRenderer(boneStructure, boneValue);
    case "date":
      return dateBoneRenderer(boneStructure, boneValue);
    case "record":
      return recordBoneRenderer(boneStructure, boneValue);
    case "relational":
      if (boneStructure["type"].startsWith("relational.tree.leaf.file")) {
        return fileBoneRenderer(boneStructure, boneValue);
      }

      return relationalBoneRenderer(boneStructure, boneValue);
    case "select":
      return selectBoneRenderer(boneStructure, boneValue);
  }
  return ""
}

function rawBoneRenderer(boneStructure: object, boneValue: any, formater: Function = formatstring) {
  if (boneValue === null) {
    return "-";
  }
  if (boneStructure["languages"] !== null) {


    return `
        <sl-tab-group>
          ${getTabs(boneStructure)}
          ${getTabPannels(boneValue, boneStructure, formater)}
        </sl-tab-group>`;

  } else {

    if (boneStructure["multiple"]) {
      for (const index in boneValue) {

        boneValue[index] = formater(boneValue[index], boneStructure, null);
      }
      return `${boneValue.join("<br>")} `
    }
  }


  return formater(boneValue, boneStructure);
}

function stringBoneRenderer(boneStructure: object, boneValue: any): any {
  return rawBoneRenderer(boneStructure, boneValue);
}


function numericBoneRenderer(boneStructure: object, boneValue: any): any {
  return rawBoneRenderer(boneStructure, boneValue);
}

function dateBoneRenderer(boneStructure: object, boneValue: any): any {
  if (boneStructure["multiple"]) {
    return `${boneValue.map((ele: any) => {
      return new Date(ele).toLocaleString();
    }).join("<br>")}`

  }
  return new Date(boneValue).toLocaleString();
}

function recordBoneRenderer(boneStructure: any, boneValue: any) {
  return rawBoneRenderer(boneStructure, boneValue);

}

function relationalBoneRenderer(boneStructure: any, boneValue: any) {
  return rawBoneRenderer(boneStructure, boneValue);

}

function fileBoneRenderer(boneStructure: any, boneValue: any) {
  function appendImage(data, boneStructure, lang = null) {
    let val = formatstring(data, boneStructure, lang);
    if (lang !== null) {
      if (boneStructure["multiple"]) {
        for (const i in val) {
          val[i]= `<img src="${data[lang][i]["dest"]["downloadUrl"]}">` + val[i]
        }
      } else {
        val = `<img src="${data[lang]["dest"]["downloadUrl"]}">` + val
      }

    } else {
      val = `<img src="${data["dest"]["downloadUrl"]}">` + val
    }

    return val;
  }

  return rawBoneRenderer(boneStructure, boneValue, appendImage);

}


function selectBoneRenderer(boneStructure: any, boneValue: any) {
  console.log(boneValue)
  //Map bonevalue to item in obj
  if (boneStructure["languages"] !== null) {
    if (boneStructure["multiple"]) {
      for (const lang of boneStructure["languages"]) {
        for (const i in boneValue[lang]) {
          boneStructure["values"].forEach((value: any) => {
            if (boneValue[lang][i] === value[0]) {
              boneValue[lang][i] = value[1];
            }
          })
        }
      }

    } else {
      for (const lang of boneStructure["languages"]) {
        boneStructure["values"].forEach((value: any) => {
          if (boneValue[lang] === value[0]) {
            boneValue[lang] = value[1];
          }
        })
      }
    }
  } else {
    if (boneStructure["multiple"]) {
      for (const i in boneValue) {
        boneStructure["values"].forEach((value: any) => {
          if (boneValue[i] === value[0]) {
            boneValue[i] = value[1];
          }
        })
      }


    } else {
      boneStructure["values"].forEach((value: any) => {
        if (boneValue === value[0]) {
          boneValue = value[1];
          return;
        }
      })
    }
  }


  return rawBoneRenderer(boneStructure, boneValue);

}

////////////HELPER FUNCTIONS////////////////


export function formatstring(data, boneStructure, lang = null) {

  if (!boneStructure) {

    return data;
  }
  if (boneStructure["format"] === undefined) {
    return data;
  }
  let re = /\$\(([^)]+)\)/g;
  let newboneStructure = {};
  const isRelational = boneStructure["type"].startsWith("relational")
  if (isRelational) {
    if (Array.isArray(boneStructure["relskel"])) {


      for (let i = 0; i < boneStructure["relskel"].length; i++) {
        for (let j = 0; j < boneStructure["relskel"][i].length; j += 2) {

          newboneStructure[boneStructure["relskel"][i][j]] = boneStructure["relskel"][i][j + 1];

        }
      }

    }
  } else {
    if (Array.isArray(boneStructure["using"])) {


      for (let i = 0; i < boneStructure["using"].length; i++) {
        for (let j = 0; j < boneStructure["using"][i].length; j += 2) {

          newboneStructure[boneStructure["using"][i][j]] = boneStructure["using"][i][j + 1];

        }
      }

    }
  }

  let format = boneStructure["format"];
  let text = boneStructure["format"];
  let textArray = [];
  for (const match of format.matchAll(re)) {

    let insidematch = match[1];

    if (boneStructure["languages"]) {
      if (boneStructure["multiple"]) {
        if (textArray.length === 0) {
          for (const i in data[lang]) {
            textArray.push(text);
          }
        }

        for (const i in data[lang]) {


          const insidematchLang = insidematch.replace("dest.", "");
          const x = formatstring(getPath(data[lang][i], insidematch), newboneStructure[insidematchLang], lang);

          if (newboneStructure[insidematchLang]["type"] == "record") {
            textArray[i] = textArray[i].replaceAll(match[0], x.join("\n"));
          } else if (getPath(newboneStructure, insidematchLang)["type"].startsWith("relational")) {
            textArray[i] = textArray[i].replaceAll(match[0], x.join("\n"));
          } else {
            textArray[i] = textArray[i].replaceAll(match[0], x.toString())
          }


        }

      } else {
        let tmp = formatstring(getPath(data[lang], insidematch), newboneStructure[insidematch], lang);
        if (tmp === undefined) {
          tmp = "";
        }
        text = text.replaceAll(match[0], tmp.toString());
      }

    } else {
      if (boneStructure["multiple"] && !isRelational) {

        if (textArray.length === 0) {
          for (const i in data) {
            textArray.push(text);
          }

        }

        for (const i in data) {

          const x = formatstring(getPath(data[i], insidematch), newboneStructure[insidematch], lang);

          if (newboneStructure[insidematch]["type"] == "record") {
            textArray[i] = textArray[i].replaceAll(match[0], x.join("\n"))
          } else {
            textArray[i] = textArray[i].replaceAll(match[0], x.toString())
          }


        }
      } else {
        let tmp = formatstring(getPath(data, insidematch), newboneStructure[insidematch], lang);
        if (tmp === undefined) {
          tmp = "";
        }
        text = text.replaceAll(match[0], tmp)
      }

    }

  }
  if (boneStructure["multiple"] && (!isRelational || boneStructure["languages"])) {
    return textArray;
  }

  return text
}

function getPath(obj, path) {
  obj = JSON.parse(JSON.stringify(obj))
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

function getTabPannels(boneValue: any, boneStructure: any, formater: Function = formatstring) {
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

        console.log("call format", boneValue,)
        boneValue[lang] = formater(boneValue, boneStructure, lang);


        tabpannels += `<sl-tab-panel name="${lang}">${boneValue[lang].join("<br>")}</sl-tab-panel>`;
      }
    } else {

      for (const lang of boneStructure["languages"]) {
        if (boneValue[lang] === null) {
          tabpannels += `<sl-tab-panel name="${lang}">-</sl-tab-panel>`;
        } else {
          tabpannels += `<sl-tab-panel name="${lang}">${formater(boneValue, boneStructure, lang)}</sl-tab-panel>`;
        }

      }
    }
  }

  return tabpannels;


}
