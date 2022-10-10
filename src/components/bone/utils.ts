import {escapeString, getPath} from "./boneViewRenderer";

export function formatstring(data, boneStructure: object, lang = null) {

  if (!boneStructure) {

    return data;
  }
  if (boneStructure["format"] === undefined) {
    if (boneStructure["type"] === "str") {
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
