import {html} from "lit";
import {unsafeHTML} from "lit/directives/unsafe-html.js";

export class BoneViewRenderer {
  declare boneStructure: {
    descr: string,
    type: string,
    required: boolean,
    params: object,
    visible: boolean,
    readonly: boolean,
    unique: boolean,
    languages: string[],
    emptyValue: any,
    multiple: boolean,
    //Optional Fields

    //relational
    module: string,
    format: string,
    using: [],
    relskel: object,

    //select
    values: [],

    //date
    date: boolean,
    time: boolean,

    //numeric
    precision: number,
    min: number,
    max: number,

    //text
    validHtml: string[],

    //file
    validMimeTypes: string[],

    //spatial

  }
  boneValue: any;
  boneName: string;
  mainInstance: any;

  constructor(boneStructure: object, boneValue: any, boneName: any, mainInstance: any) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }


  boneFormatter(): any {
    if (!this.boneStructure) {
      return;
    }

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
      case "text":
        return this.textBoneRenderer();
      case "spatial":
        return this.spatialBoneRenderer();

    }
    return this.rawBoneRenderer();
  }


  rawBoneRenderer(formater = formatstring) {
    if (this.boneValue === null) {
      return "-";
    }
    if (this.boneStructure["languages"] !== null) {


      return html`
        <sl-tab-group>
          ${this.getTabs()}
          ${this.getTabPannels(formater)}
        </sl-tab-group>`;

    } else {


      if (this.boneStructure["multiple"]) {
        if (!Array.isArray(this.boneValue)) {
          this.boneValue = [this.boneValue];
        }
        for (const index in this.boneValue) {

          this.boneValue[index] = formater(this.boneValue[index], this.boneStructure, null);
        }
        return html`${this.boneValue.map((val: any) => [
          html`${val}<br>`
        ])}`


      }
    }
    if (this.boneStructure["type"].startsWith("text")) {
      return html`${unsafeHTML(this.boneValue)}`;
    }
    console.log("here?")
    return formater(this.boneValue, this.boneStructure)

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
            val[i] = html`<img width="32px" height="32px" src="${data[lang][i]["dest"]["downloadUrl"]}"> ${val[i]}`;
          }
        } else {
          val = html`<img width="32px" height="32px" src="${data[lang]["dest"]["downloadUrl"]}">${val}`;
        }

      } else {
        val = html`<img width="32px" height="32px" src="${data["dest"]["downloadUrl"]}">${val}`;
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
          if (!Array.isArray(this.boneValue[lang])) {
            this.boneValue[lang] = [this.boneValue[lang]];
          }
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
        if (!Array.isArray(this.boneValue)) {
          this.boneValue = [this.boneValue];
        }
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

          }
        })
      }
    }


    return this.rawBoneRenderer();

  }

  textBoneRenderer() {
    return this.rawBoneRenderer();
  }

  spatialBoneRenderer(): any {
    console.log(this.boneValue)

    return this.rawBoneRenderer();
  }
  ////////////HELPER FUNCTIONS////////////////


  getTabs() {
    let tabs: any = [];
    for (const lang of this.boneStructure["languages"]) {

      tabs.push(html`
        <sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`);
    }
    return tabs
  }


  getTabPannels(formater: Function = formatstring) {
    //We are when languages not null
    let tabpannels: any = [];
    if (this.boneStructure["format"] === undefined) {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {
          if (!Array.isArray(this.boneValue[lang])) {
            this.boneValue[lang] = [this.boneValue[lang]];
          }
          tabpannels.push(html`
            <sl-tab-panel name="${lang}"> ${this.boneValue[lang].map((val: any) => [html`${val}<br>`])}
            </sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">-</sl-tab-panel>`);
          } else {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">${this.boneValue[lang].toString()}</sl-tab-panel>`);
          }

        }
      }
    } else {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {

          console.log("call format", this.boneValue,)
          this.boneValue[lang] = formater(this.boneValue, this.boneStructure, lang);


          tabpannels.push(html`
            <sl-tab-panel name="${lang}">${this.boneValue[lang].map((val: any) => [html`${val}<br>`])}</sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpannels += html`
              <sl-tab-panel name="${lang}">-</sl-tab-panel>`;
          } else {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">${formater(this.boneValue, this.boneStructure, lang)}</sl-tab-panel>`);
          }

        }
      }
    }

    return tabpannels;


  }


}

////////////HELPER FUNCTIONS////////////////


export function formatstring(data, boneStructure: object, lang = null) {

  if (!boneStructure) {

    return data;
  }
  if (boneStructure["format"] === undefined) {
    if(boneStructure["type"]==="str")
    {
      return escapeString(data);
    }
    return data.toString();
  }
  let re = /\$\(([^)]+)\)/g;
  let newboneStructure = {};
  const isRelational = boneStructure["type"].startsWith("relational")
  const isRecord = boneStructure["type"].startsWith("record")
  if (isRelational) {
    if (Array.isArray(boneStructure["relskel"])) {


      for (let i = 0; i < boneStructure["relskel"].length; i++) {
        for (let j = 0; j < boneStructure["relskel"][i].length; j += 2) {

          newboneStructure[boneStructure["relskel"][i][j]] = boneStructure["relskel"][i][j + 1];

        }
      }

    }
    else
    {
      newboneStructure=boneStructure["relskel"]
    }
  } else {
    if (Array.isArray(boneStructure["using"])) {


      for (let i = 0; i < boneStructure["using"].length; i++) {
        for (let j = 0; j < boneStructure["using"][i].length; j += 2) {

          newboneStructure[boneStructure["using"][i][j]] = boneStructure["using"][i][j + 1];

        }
      }

    }
    else {
      newboneStructure=boneStructure["using"]
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
          if (Array.isArray(data)) {
            for (const i in data) {
              textArray.push(text);
            }
          } else {
            textArray = [text];
          }

        }
        let i = -1;
        let index = 0;
        for (const key in data) {
          let x;

          if (Array.isArray(data)) {
            x = formatstring(getPath(data[key], insidematch), newboneStructure[insidematch], lang);

          } else {

            x = formatstring(getPath(data, insidematch), newboneStructure[insidematch], lang);
            i += 1;
          }

          if (newboneStructure[insidematch]["type"] === "record") {

            textArray[index] = textArray[index].replaceAll(match[0], x.join("\n"))
          } else {
            textArray[0] = textArray[0].replaceAll(match[0], x.toString())
          }
          index += 1;


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

export function getPath(obj: object, path: string | string[]): object | undefined {

  path = typeof path === 'string' ? path.split('.') : path;

  let current: object = JSON.parse(JSON.stringify(obj))//Depth Copy to lose Reference;
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

function escapeString(value) {
  if(Array.isArray(value))
  {
    for(const i in value)
    {
      value[i]=escapeString(value[i]);
    }
    return value
  }
  else
  {
    return value.replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#040;", "(")
    .replaceAll("&#041;", ")")
    .replaceAll("&#061;", "=")
  }

}



