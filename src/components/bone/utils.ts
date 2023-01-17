// @ts-nocheck
import translationtable from "./translations/init"
import type {BoneStructure, BoneValue} from "./bones/rawBone";
import * as path from "path";

export function formatstring(data: BoneValue, boneStructure: BoneStructure, lang: string | null = null, ignoreLang = false): BoneValue {
  if (!boneStructure) {

    return data;
  }
  if (boneStructure["format"] === undefined) {
    if (boneStructure["type"] === "str") {
      return escapeString(data);
    }
    return data;
  }
  const re = /\$\(([^)]+)\)/g;
  let newboneStructure = {};
  const isRelational = boneStructure["type"].startsWith("relational")

  if (isRelational) {
    if (Array.isArray(boneStructure["relskel"])) {


      for (let i = 0; i < boneStructure["relskel"].length; i++) {
        for (let j = 0; j < boneStructure["relskel"][i].length; j += 2) {

          newboneStructure[boneStructure["relskel"][i][j]] = boneStructure["relskel"][i][j + 1];

        }
      }

    } else {
      newboneStructure = boneStructure["relskel"]
    }
  } else {
    if (Array.isArray(boneStructure["using"])) {


      for (let i = 0; i < boneStructure["using"].length; i++) {
        for (let j = 0; j < boneStructure["using"][i].length; j += 2) {

          newboneStructure[boneStructure["using"][i][j]] = boneStructure["using"][i][j + 1];

        }
      }

    } else {
      newboneStructure = boneStructure["using"]
    }
  }

  const format = boneStructure["format"];
  let text = boneStructure["format"];
  let textArray = [];
  for (const match of format.matchAll(re)) {

    const insidematch = match[1];

    if (boneStructure["languages"] && !ignoreLang) {
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
  if (boneStructure["multiple"] && (!isRelational || boneStructure["languages"]) && !ignoreLang) {
    return textArray;
  }

  return text
}

export function createPath(obj: object, path: string | string[], value: any | null = null, mustdelete = false, mustsplice = false) {

  path = typeof path === 'string' ? path.split('.') : path;
  let current: object = obj;


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
  if (mustdelete) {
    current.splice(path[0], 1);
  } else {
    if (mustsplice) {
      current.splice(path[0], 0, value);
    } else {
      current[path[0]] = value;
    }

  }

  return obj;


}

export function getPath(obj: object, path: string | string[]): BoneValue | undefined {
  path = typeof path === 'string' ? path.split('.') : path;

  let current: object = JSON.parse(JSON.stringify(obj));//Depth Copy to lose Reference;
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

export function escapeString(value: BoneValue): string | string[] {
  if (value === null) {
    return "";
  }
  if (Array.isArray(value)) {
    value.map(v => escapeString(v));


  } else if (typeof value === "object") {
    for (const key in value) {
      value[key] = escapeString(value[key]);
    }
  } else {
    value = value.replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&#39;", "'")
      .replaceAll("&#040;", "(")
      .replaceAll("&#041;", ")")
      .replaceAll("&#061;", "=")
  }
  return value

}

//const apiurl=window.location.origin;
export const apiurl = "http://localhost:8080";

export function getSkey() {
  return new Promise<string>((resolve, reject) => {

    fetch(`${apiurl}/json/skey`).then(response => response.json()).then((skey: string) => {
      resolve(skey)
    }).catch((reason) => {
      reject(reason)
    })

  })
}

function _translate({path="", lang = "en", values = {}}): string {

  let msg:string= getPath(translationtable[lang], path)
  for(const key of Object.keys(values))
  {
    msg = msg.replace(`{{${key}}}`,values[key]);
  }

  return msg
}
//Proxy function for translate
export  function translate(...args)
{
  console.log(args)
  if(args.length===1)
  {
    return _translate({path:args[0]})
  }
  else if(args.length===2)
  {
    return _translate({...{path:args[0]},...args[1]})
  }
}
