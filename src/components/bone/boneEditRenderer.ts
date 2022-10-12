import {escapeString, formatstring, getPath} from "./boneViewRenderer";
import {formatstring} from "./utils";
import SlBone from "./bone";
import SlCombobox from "../combobox/combobox";
import SlIcon from "../icon/icon";
import SlButton from "../button/button";
import SlIconButton from "../icon-button/icon-button";
import SlSelect from "../select/select";
import {emit} from "../../internal/event";
import SlDetails from "../details/details";
import {StringBone} from "./bones/stringBone";
import {NumericBone} from "./bones/numericBone";
import {DateBone} from "./bones/dateBone";
import {BooleanBone} from "./bones/booleanBone";
import {SelectBone} from "./bones/selectBone";
import {RelationalBone} from "./bones/relationalBone";
import {RecordBone} from "./bones/recordBone";
import {RawBone} from "./bones/rawBone";
import {FileBone} from "./bones/fileBone";
import {SpatialBone} from "./bones/spatialBone";


export class BoneEditRenderer {

  blurCounter = 0;
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
    validHtml: string[]

    //file
    validMimeTypes: string[]

  }

  declare boneValue: any | any[];
  boneName: string;
  mainInstance: SlBone;
  depth = 0;
  //Move vars
  move = false;
  moveElement;
  startHeight = 0;
  startTop = 0;
  fakeElement;
  inputsAbsolutePostions = [];
  absolutePostionSet = false;
  swapElements = [null, null];
  moveElementSrc: HTMLElement;


  constructor(boneStructure: object, boneValue: any, boneName: any, mainInstance: SlBone) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;

    /*
    if (this.boneStructure["type"].startsWith("relational")) {
      console.log(this.boneValue)
      if (this.boneValue !== null && typeof (this.boneValue) !== "string") {
        if (this.boneStructure["languages"] !== null) {
          if (this.boneStructure["multiple"]) {

            for (const lang of this.boneStructure["languages"]) {
              for (const [i, tmpValue] of this.boneValue[lang].entries()) {
                const key = this.boneValue[lang][i]["dest"]["key"];
                this.mainInstance.relationalCache[key] = tmpValue;
                this.boneValue[lang][i] = key;
              }
            }
          } else {
            for (const lang of this.boneStructure["languages"]) {
              const key = this.boneValue[lang]["dest"]["key"];
              this.mainInstance.relationalCache[key] = this.boneValue[lang];
              this.boneValue[lang] = key;
            }
          }
        } else {
          if (this.boneStructure["multiple"]) {
            for (const [i, tmpValue] of this.boneValue.entries()) {
              const key = tmpValue["dest"]["key"];
              this.mainInstance.relationalCache[key] = tmpValue;
              this.boneValue[i] = key;

            }
          } else {
            const key = this.boneValue["dest"]["key"];
            this.mainInstance.relationalCache[key] = this.boneValue;
            this.boneValue = key;
          }
        }
      }

    }
    console.log("cache", this.mainInstance.relationalCache);
    console.log("bone", this.boneValue);
    */
  }


  boneEditor(fromRecord: boolean = false, depth: number): HTMLElement {
    return this.getEditor();
  }

  getEditor(value: any, boneName = "") {
    let cls:any;
    switch (this.boneStructure["type"].split(".")[0]) {
      case "str":
        cls = StringBone;
        break;
      case "numeric":
        cls = NumericBone;
        break;
      case "date":
        cls = DateBone;
        break;
      case "bool":
        cls = BooleanBone;
        break;
      case "record":
        cls = RecordBone;
        break;
      case "relational":
        cls = RelationalBone;
        if (this.boneStructure["type"].startsWith("relational.tree.leaf.file")) {
          cls = FileBone;
        }
        break;
      case "select":
        cls = SelectBone;
        break;
      case "spatial":
        cls = SpatialBone;
        break;
      default:
        return RawBone
    }
    return new cls(this.boneValue, this.boneName, this.boneStructure, this.mainInstance).edit()


  }


  fileBoneEditorRenderer(value: any, boneName = "") {
    /**
     * value can be :
     * null if a empty bone is renderd (multiple add)
     * key if we are in a add an we extend a multiple value
     * {dest:{name:"bla",key:"blablakey"}}
     *
     *
     */
    console.log("init filebone with", value, boneName);
    if (typeof (value) === "object" && value !== null) {
      if ("dest" in value) {
        const key = value["dest"]["key"]
        this.mainInstance.relationalCache[key] = value;
        value = key;
      }
    }
    const fileContainer = document.createElement("div");
    //TODO outsoucre style
    fileContainer.style.display = "flex";
    fileContainer.style.flexDirection = "row";
    fileContainer.dataset.boneName = boneName;

    const shadowFile = document.createElement("input");
    const shadowKey = document.createElement("sl-input");
    const fileNameInput = document.createElement("sl-input");
    const uploadButton = document.createElement("sl-button");
    const clearButton = document.createElement("sl-button");

    uploadButton.innerText = "Select";
    uploadButton.addEventListener("click", () => {
      shadowFile.click();
    })

    clearButton.innerText = "Clear";
    clearButton.id = "clearButton";
    shadowFile.type = "file";
    let filter: string;

    if (this.boneStructure["validMimeTypes"] !== null && this.boneStructure["validMimeTypes"] !== undefined) {
      if (this.boneStructure["validMimeTypes"].indexOf("*") == -1) {
        filter = this.boneStructure["validMimeTypes"].join(",")
      } else {
        filter = "*";
      }

    } else {
      filter = "*";
    }

    shadowFile.accept = filter;
    shadowFile.hidden = true;

    shadowKey.hidden = true;
    shadowKey.name = boneName;
    if (value !== null) {
      shadowKey.value = value;
    }


    shadowFile.addEventListener("change", (e: Event) => {

      const file: File = e.target.files[0];
      getUploadUrl(file).then(uploadData => {

        fileNameInput.value = "Uploading...";
        uploadFile(file, uploadData).then(resp => {


          addFile(uploadData).then((fileData: object) => {
            this.mainInstance.relationalCache[fileData["values"]["key"]] = {dest: fileData["values"]}

            shadowKey.value = fileData["values"]["key"];

            fileNameInput.value = fileData["values"]["name"];

            const obj = this.reWriteBoneValue();

            this.mainInstance.internboneValue = obj;
            this.mainInstance.handleChange();

          })

        });
      });
    });
    //fileNameInput
    fileNameInput.disabled = true;
    fileNameInput.style.flexGrow = "1";
    if (value !== null && value !== "") { //Fixme why ==""
      try {
        fileNameInput.value = this.mainInstance.relationalCache[value]["dest"]["name"];
      } catch (e) {
        console.log("erorr in file value", value);
      }

    }


    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(shadowKey);
    fileContainer.appendChild(fileNameInput);

    fileContainer.appendChild(uploadButton);
    fileContainer.appendChild(clearButton);
    return fileContainer;
  }


  spatialBoneEditorRenderer(value: any, boneName = "") {

  }


}

/////////////////HELPER FUNCTRIONS/////////////////
function getSkey() {
  return new Promise((resolve, reject) => {

    fetch(`${apiurl}/json/skey`).then(response => response.json()).then((skey) => {
      resolve(skey)
    }).catch((reason) => {
      reject(reason)
    })

  })
}

function createPath(obj: object, path: string | string[], value: any | null = null, mustdelete = false, mustsplice = false) {

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

/////////////////FILEBONE FUNCTRIONS/////////////////

function getUploadUrl(file: File) {
  return new Promise((resolve, reject) => {
    getSkey().then(skey => {

      const data: object = {
        "fileName": file.name,
        "mimeType": file.type,
        "size": file.size,
        "skey": skey,
      }
      fetch(`${apiurl}/json/file/getUploadURL`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString()
      }).then(response => response.json()).then((data) => resolve(data))
    })
  });
}

function uploadFile(file: File, uploadData: any) {

  return new Promise((resolve, reject) => {
    fetch(uploadData["values"]["uploadUrl"], {
      method: "POST",
      body: file,
      mode: "no-cors",

    }).then(response => {
      resolve(response)
    }).catch((reason) => reject(reason))
  })

}

function addFile(uploadData: any) {


  return new Promise((resolve, reject) => {
    const currentUpload: object = {};
    currentUpload["key"] = uploadData["values"]["uploadKey"];
    currentUpload["node"] = undefined;
    currentUpload["skelType"] = "leaf";
    getSkey().then(skey => {
      currentUpload["skey"] = skey;
      fetch(`${apiurl}/json/file/add`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        mode: "no-cors",
        body: new URLSearchParams(currentUpload).toString(),
      }).then(response => response.json()).then((data) => {
        resolve(data);
      });
    });
  });
}
