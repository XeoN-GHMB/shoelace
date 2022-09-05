import {html} from "lit";

export class BoneViewRenderer {
  boneStructure: any;
  boneValue: any;
  boneName: string;
  mainInstance: any;

  constructor(boneStructure: any, boneValue: any, boneName: any, mainInstance: any) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }


  boneFormatter(): any {

    switch (this.boneStructure["type"].split(".")[0]) {
      case "str":
        return this.stringBoneRenderer();
      case "numeric":
        return this.numericBoneRenderer();
      case "date":
        return this.dateBoneRenderer();
      case "record":
        return this.recordBoneRenderer();
      case "relational":
        if (this.boneStructure["type"].startsWith("relational.tree.leaf.file")) {
          return this.fileBoneRenderer();
        }
        return this.relationalBoneRenderer();
      case "select":
        return this.selectBoneRenderer();
    }
    return ""
  }


  rawBoneRenderer(formater: Function = formatstring) {
    if (this.boneValue === null) {
      return "-";
    }
    if (this.boneStructure["languages"] !== null) {


      return html`
        <sl-tab-group>
          ${getTabs(this.boneStructure)}
          ${getTabPannels(this.boneValue, this.boneStructure, formater)}
        </sl-tab-group>`;

    } else {

      if (this.boneStructure["multiple"]) {
        for (const index in this.boneValue) {

          this.boneValue[index] = formater(this.boneValue[index], this.boneStructure, null);
        }
        return html`${this.boneValue.map((val: any) => [
          html`${val}<br>`
        ])}`


      }
    }


    return formater(this.boneValue, this.boneStructure);
  }


  stringBoneRenderer(): any {
    return this.rawBoneRenderer();
  }


  numericBoneRenderer(): any {
    return this.rawBoneRenderer();
  }


  dateBoneRenderer(): any {
    if (this.boneStructure["multiple"]) {
      return `${this.boneValue.map((ele: any) => {
        return new Date(ele).toLocaleString();
      }).join("<br>")}`

    }
    return new Date(this.boneValue).toLocaleString();
  }


  recordBoneRenderer() {
    return this.rawBoneRenderer();

  }


  relationalBoneRenderer() {
    return this.rawBoneRenderer();

  }


  fileBoneRenderer() {

    function appendImage(data, boneStructure, lang = null) {
      let val = formatstring(data, boneStructure, lang);
      if (lang !== null) {
        if (boneStructure["multiple"]) {
          for (const i in val) {
            val[i] = `<img width="32px" height="32px" src="${data[lang][i]["dest"]["downloadUrl"]}">` + val[i]
          }
        } else {
          val = `<img width="32px" height="32px" src="${data[lang]["dest"]["downloadUrl"]}">` + val
        }

      } else {
        val = `<img width="32px" height="32px" src="${data["dest"]["downloadUrl"]}">` + val
      }

      return val;
    }

    return this.rawBoneRenderer(appendImage);

  }


  selectBoneRenderer() {

    //Map this.boneValue to item in obj
    if (this.boneStructure["languages"] !== null) {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {
          for (const i in this.boneValue[lang]) {
            this.boneStructure["values"].forEach((value: any) => {
              if (this.boneValue[lang][i] === value[0]) {
                this.boneValue[lang][i] = value[1];
              }
            })
          }
        }

      } else {
        for (const lang of this.boneStructure["languages"]) {
          this.boneStructure["values"].forEach((value: any) => {
            if (this.boneValue[lang] === value[0]) {
              this.boneValue[lang] = value[1];
            }
          })
        }
      }
    } else {
      if (this.boneStructure["multiple"]) {
        for (const i in this.boneValue) {
          this.boneStructure["values"].forEach((value: any) => {
            if (this.boneValue[i] === value[0]) {
              this.boneValue[i] = value[1];
            }
          })
        }


      } else {
        this.boneStructure["values"].forEach((value: any) => {
          if (this.boneValue === value[0]) {
            this.boneValue = value[1];
            return;
          }
        })
      }
    }


    return this.rawBoneRenderer();

  }
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
  let tabs: any = [];
  for (const lang of boneStructure["languages"]) {

    tabs.push(html`
      <sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`);
  }
  return tabs
}


function getTabPannels(boneValue: any, boneStructure: any, formater: Function = formatstring) {
  //We are when languages not null
  let tabpannels: any = [];
  if (boneStructure["format"] === undefined) {
    if (boneStructure["multiple"]) {
      for (const lang of boneStructure["languages"]) {
        tabpannels.push(html`
          <sl-tab-panel name="${lang}"> ${boneValue[lang].map((val: any) => [html`${val}<br>`])}</sl-tab-panel>`);
      }
    } else {

      for (const lang of boneStructure["languages"]) {
        if (boneValue[lang] === null) {
          tabpannels.push(html`
            <sl-tab-panel name="${lang}">-</sl-tab-panel>`);
        } else {
          tabpannels.push(html`
            <sl-tab-panel name="${lang}">${boneValue[lang].toString()}</sl-tab-panel>`);
        }

      }
    }
  } else {
    if (boneStructure["multiple"]) {
      for (const lang of boneStructure["languages"]) {

        console.log("call format", boneValue,)
        boneValue[lang] = formater(boneValue, boneStructure, lang);


        tabpannels.push(html`
          <sl-tab-panel name="${lang}">${boneValue[lang].map((val: any) => [html`${val}<br>`])}</sl-tab-panel>`);
      }
    } else {

      for (const lang of boneStructure["languages"]) {
        if (boneValue[lang] === null) {
          tabpannels += html`
            <sl-tab-panel name="${lang}">-</sl-tab-panel>`;
        } else {
          tabpannels.push(html`
            <sl-tab-panel name="${lang}">${formater(boneValue, boneStructure, lang)}</sl-tab-panel>`);
        }

      }
    }
  }

  return tabpannels;


}
