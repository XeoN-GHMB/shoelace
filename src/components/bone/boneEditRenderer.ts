import {formatstring, getPath} from "./boneViewRenderer";
import SlBone from "./bone";
import SlCombobox from "../combobox/combobox";
import SlIcon from "../icon/icon";
import SlButton from "../button/button";
import SlIconButton from "../icon-button/icon-button";
//const apiurl=window.location.origin;
const apiurl = "http://localhost:8080";

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
  boneRenderer = {"str": this.stringBoneEditorRenderer};
  depth = 0;
  move = false;
  moveElement;
  startHeight = 0;
  fakeElement;

  constructor(boneStructure: object, boneValue: any, boneName: any, mainInstance: SlBone) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }


  boneEditor(fromRecord: boolean = false, depth: number): HTMLElement {
    if (depth !== undefined) {
      this.depth = depth;
    }

    let wrapper: HTMLElement;
    if (fromRecord) {
      wrapper = document.createElement("div");

    } else {
      wrapper = document.createElement("form");

      wrapper.addEventListener("submit", (e: Event) => {

        e.preventDefault()
        return false;
      })
    }


    wrapper.dataset.boneWrapper = "true";
    wrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    wrapper.dataset.boneName = this.boneName;
    if (this.boneStructure["languages"] !== null) {
      const tabGroup = document.createElement("sl-tab-group");
      for (const lang of this.boneStructure["languages"]) {
        //Create Tabs for Langs
        const tab = document.createElement("sl-tab");
        tab.slot = "nav";
        tab.panel = lang;
        tab.innerText = lang;
        tabGroup.appendChild(tab);
      }

      for (const lang of this.boneStructure["languages"]) {

        const tab_panel = document.createElement("sl-tab-panel")
        tab_panel.name = lang;
        if (this.boneStructure.multiple && this.boneStructure["type"] !== "select") {
          const inputWrapper = document.createElement("div");

          for (const tmpValue of this.boneValue[lang]) {

            let newboneName = this.boneName + "." + lang;
            if (this.boneStructure["type"] === "record") {
              newboneName = this.boneName + "." + lang + ".$(index)";
            }

            const inputElement = this.getEditor(tmpValue, newboneName);
            inputElement.dataset.lang = lang;
            inputElement.dataset.multiple = this.boneStructure["multiple"];
            inputWrapper.appendChild(inputElement);
          }

          const addButton = document.createElement("sl-button");

          addButton.addEventListener("click", () => {
            //const newboneName = boneName //FIXME RECORD BONE

            let newboneName = this.boneName + "." + lang;
            if (this.boneStructure["type"] === "record") {
              newboneName += ".$(index)";
            }
            const inputElement = this.getEditor(null, newboneName);
            inputElement.dataset.lang = lang;
            inputElement.dataset.multiple = this.boneStructure["multiple"];
            inputWrapper.insertBefore(inputElement, addButton);


          });
          addButton.innerText = "Add";
          inputWrapper.appendChild(addButton);
          tab_panel.appendChild(inputWrapper);

        } else {
          //Lang , no multipler
          const newboneName = this.boneName + "." + lang;
          const inputElement = this.getEditor(this.boneValue[lang], newboneName);
          inputElement.dataset.lang = lang;
          inputElement.dataset.multiple = this.boneStructure["multiple"];
          tab_panel.appendChild(inputElement);
        }
        tabGroup.appendChild(tab_panel);


      }
      wrapper.appendChild(tabGroup);

    } else {

      if (this.boneStructure["multiple"] && this.boneStructure["type"] !== "select") {
        //No Lang , Multiple

        wrapper.dataset.boneName = this.boneName;
        if (this.boneValue === null) {
          this.boneValue = []
        }

        const addButton = document.createElement("sl-button");
        for (const tmpValue of this.boneValue) {
          let newboneName = this.boneName;
          if (this.boneStructure["type"] === "record") {
            newboneName = this.boneName + ".$(index)";
          }


          const boneWrapper = document.createElement("div");

          const inputElement: HTMLElement = this.getEditor(tmpValue, newboneName);
          inputElement.dataset.lang = "null";
          inputElement.dataset.multiple = this.boneStructure["multiple"];


          inputElement.querySelector("#clearButton").addEventListener("click", () => {
            this.reWriteBoneValue()
            boneWrapper.remove();
            addButton.focus();

          });


          boneWrapper.appendChild(inputElement);
          //TODo for later
          /*
          inputElement.querySelector("#dragger").addEventListener("mousedown", (e) => {
            if(!this.move)
            {
              this.move = true;
            }

            e.preventDefault();
            this.moveElement = boneWrapper.cloneNode(true);

            this.moveElement.style.borderStyle="solid";
            this.moveElement.style.position="absolute";
            this.moveElement.style.zIndex="2";

            this.fakeElement= document.createElement("div");
            this.fakeElement.style.height=boneWrapper.clientHeight+"px";
            this.fakeElement.style.width=boneWrapper.clientWidth+"px";
            this.fakeElement.style.backgroundColor="#d9fcff";

            this.startHeight=boneWrapper.clientHeight;
            wrapper.insertBefore(this.moveElement,boneWrapper);
            wrapper.insertBefore(this.fakeElement,boneWrapper);

            boneWrapper.remove();

          })

          document.addEventListener("mouseup", (e) => {
            this.move = false;
            e.preventDefault();

          })
          document.addEventListener("mousemove", (e: MouseEvent) => {
            if (this.move) {

              //const yPos = e.pageY - this.moveElement.getBoundingClientRect().top-(this.startHeight/2);
              this.moveElement.style.top =(e.pageY- this.startHeight/2)+ "px";


            }


          })
*/
          wrapper.appendChild(boneWrapper);

        }


        addButton.addEventListener("click", () => {
          //FIXME RECORD BONE

          const boneWrapper = document.createElement("div");
          let newboneName = this.boneName;
          if (this.boneStructure["type"] === "record") {
            newboneName = this.boneName + ".$(index)";
          }
          const inputElement = this.getEditor(null, newboneName);
          inputElement.dataset.lang = "null";
          inputElement.dataset.multiple = this.boneStructure["multiple"];
          inputElement.querySelector("#clearButton").addEventListener("click", () => {
            this.reWriteBoneValue()
            boneWrapper.remove();
            addButton.focus();

          });


          boneWrapper.appendChild(inputElement);

          wrapper.insertBefore(boneWrapper, addButton);

          wrapper.focus();


        });
        addButton.innerText = "Add";
        wrapper.appendChild(addButton);


      } else {
        //No Lang, No Multiple
        const inputElement = this.getEditor(this.boneValue, this.boneName)
        inputElement.dataset.lang = "null";
        inputElement.dataset.multiple = this.boneStructure["multiple"];
        wrapper.appendChild(inputElement);


      }
    }
    wrapper.addEventListener("sl-focus", (focus_event) => {

      this.blurCounter += 1;


    });
    wrapper.addEventListener("sl-blur", (blur_event) => {

      this.blurCounter -= 1;
      console.log("lost focus")
      return
      const self: BoneEditRenderer = this;
      setTimeout(function () {

        if (self.blurCounter === 0) {
          const formData = self.reWriteBoneValue();
          self.mainInstance.handleChange(formData);


        }
      }, 20)
    });

    return wrapper;


  }


  getEditor(value: any, boneName = "") {
    switch (this.boneStructure["type"].split(".")[0]) {
      case "str":
        return this.stringBoneEditorRenderer(value, boneName);
      case "numeric":
        return this.numericBoneEditorRenderer(value, boneName);
      case "date":
        return this.dateBoneEditorRenderer(value, boneName);
      case "bool":
        return this.booleanBoneEditorRenderer(value, boneName);
      case "record":
        return this.recordBoneEditorRenderer(value, boneName);
      case "relational":
        if (this.boneStructure["type"].startsWith("relational.tree.leaf.file")) {
          return this.fileBoneEditorRenderer(value, boneName);
        }
        return this.relationBoneEditorRenderer(value, boneName);
      case "select":
        return this.selectBoneEditorRenderer(value, boneName);
      default:
        return this.rawBoneEditorRenderer(value, boneName);
    }

  }


  rawBoneEditorRenderer(value: any, boneName = "") {
    const inputElement = document.createElement("sl-input");
    const clearButton: SlIconButton = document.createElement("sl-icon-button")
    clearButton.library = "my-icons";
    clearButton.slot = "suffix";
    clearButton.name = "x-circle";
    clearButton.id = "clearButton"
    inputElement.appendChild(clearButton);
    //ToDo
    /*
    const draggable = document.createElement("sl-icon")
    draggable.library = "my-icons";
    draggable.slot = "prefix";
    draggable.name = "draggable";
    draggable.id = "dragger";
    inputElement.appendChild(draggable);
     */
    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;

    if (value === null) {
      inputElement.value = "";
    } else {
      inputElement.value = value;
    }

    inputElement.addEventListener("keypress", (keypress_event) => {

      if (keypress_event.key !== "Enter") return;
      let isValid: boolean = false;
      if (this.boneStructure["required"]) {

        this.mainInstance.bone.querySelectorAll("sl-input").forEach((tmpInput) => {
          if (tmpInput.value !== null) {
            if (tmpInput.value.length > 0) {
              isValid = true;
            }
          }

        })
      } else {
        isValid = true;
      }
      if (isValid) {
        const formData = this.reWriteBoneValue();
        this.mainInstance.handleChange(formData);

      } else {
        //this.mainInstance.bone.querySelector("sl-input").setCustomValidity("Please Fill");

        inputElement.setCustomValidity("Please Fill");


      }

    })

    return inputElement;
  }

  stringBoneEditorRenderer(value: any, boneName = "") {

    return this.rawBoneEditorRenderer(value, boneName);
  }


  numericBoneEditorRenderer(value: any, boneName = "") {

    const numericBone = this.rawBoneEditorRenderer(value, boneName);
    numericBone.type = "number";
    numericBone.min = this.boneStructure["min"];
    numericBone.max = this.boneStructure["max"];
    return numericBone;
  }


  dateBoneEditorRenderer(value: string, boneName = "") {

    const dateBone = this.rawBoneEditorRenderer(value, boneName);

    if (this.boneStructure["time"]) {

      dateBone.type = "datetime-local"
      dateBone.value = value.split('+')[0]
    } else {
      dateBone.type = "date"
      dateBone.value = (new Date(value)).toISOString().substr(0, 10);
    }


    return dateBone;
  }


  booleanBoneEditorRenderer(value: boolean, boneName = "") {

    const inputElement = document.createElement("sl-switch");
    inputElement.dataset.boneName = boneName;
    inputElement.value = value.toString();


    return inputElement;
  }


  recordBoneEditorRenderer(value: any, boneName = "") {


    const inputWrapper = document.createElement("form");
    inputWrapper.dataset.boneName = this.boneName;
    inputWrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    inputWrapper.dataset.depth = this.depth.toString();


    for (const bone of this.boneStructure["using"]) {
      const recordBoneName: string = bone[0];
      const recordBoneStructure: [] = bone[1];
      let recordBoneValue: any = null;
      if (value !== null) {
        recordBoneValue = value[bone[0]];

      }


      const newBoneName = boneName + "." + recordBoneName;
      const tmp_renderer = new BoneEditRenderer(recordBoneStructure, recordBoneValue, newBoneName, this.mainInstance)
      const tmp: HTMLElement = tmp_renderer.boneEditor(true, this.depth + 1);
      tmp.dataset.fromRecord = "true";


      inputWrapper.appendChild(tmp);
    }
    inputWrapper.addEventListener("submit", (e) => {

      e.preventDefault()
    })
    return inputWrapper;


  }


  relationBoneEditorRenderer(value: any, boneName = "") {

    const inputWrapper = document.createElement("div");
    const shadowInput = document.createElement("input")
    const searchBox: SlCombobox = document.createElement("sl-combobox");

    //searchBox.hoist =true
    const url = `${apiurl}/json/country/list?search={q}`;


    //searchBox.style.width = "100%";
    //searchBox.style.boxSizing = "border-box";
    searchBox.dataset.boneName = boneName;
    searchBox.name = boneName;

    //Shadow input
    shadowInput.hidden = true;
    shadowInput.name = boneName;


    searchBox.source = (search: string) => {
      return fetch(url.replace('{q}', search))
        .then(res => res.json())
        .then((data) => {

            const skellist = data["skellist"]
            return skellist.map((d: any) => {
              return {
                text: formatstring({dest: d}, this.boneStructure),
                value: JSON.stringify(d)//TODO Better Solution
              };

            })
          }
        );
    };
    inputWrapper.appendChild(shadowInput);
    inputWrapper.appendChild(searchBox);

    searchBox.addEventListener("sl-item-select", (e: CustomEvent) => {

      shadowInput.value = JSON.parse(e.detail.item.value).key;
      const formData = this.reWriteBoneValue();
      console.log(e);
      console.log(this.mainInstance.internboneValue);
      this.mainInstance.internboneValue[this.boneName] = {dest: JSON.parse(e.detail.item.value)}
      this.mainInstance.handleChange(formData);

    });

    return inputWrapper;


  }


  fileBoneEditorRenderer(value: any, boneName = "") {


    const fileContainer = document.createElement("div")
    const shadowFile = document.createElement("input");
    const shadowKey = document.createElement("input");
    const statusSpan = document.createElement("span");
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

    shadowFile.addEventListener("change", (e: Event) => {

      const file: File = e.target.files[0];
      getUploadUrl(file).then(uploadData => {

        statusSpan.innerText = "Uploading..."
        uploadFile(file, uploadData).then(resp => {


          addFile(uploadData, statusSpan).then((fileData: object) => {
            const fileKey: string = fileData["values"]["key"];
            shadowKey.value = fileKey;
            const formData = this.reWriteBoneValue();
            this.mainInstance.handleChange(formData);

          })

        });
      });
    });
    shadowFile.click();
    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(shadowKey);
    fileContainer.appendChild(statusSpan);
    return fileContainer;
  }


  selectBoneEditorRenderer(value: any, boneName = "") {

    const inputSelect = document.createElement("sl-select");

    inputSelect.name = boneName;
    inputSelect.value = value;
    inputSelect.dataset.boneName = boneName;

    inputSelect.multiple = this.boneStructure["multiple"];
    for (const option of this.boneStructure["values"]) {
      const optionElement = document.createElement("sl-menu-item");
      optionElement.value = option[0];
      optionElement.innerText = option[1];
      inputSelect.appendChild(optionElement);

    }
    inputSelect.addEventListener("sl-change", (event) => {

      const formData = this.reWriteBoneValue();
      this.mainInstance.handleChange(formData);
    });

    return inputSelect;

  }


  reWriteBoneValue() {

    const globFormdata: FormData = new FormData();
    const depthCounter: number[] = [];
    const langs: string[] = [];
    let formData: FormData = new FormData(this.mainInstance.bone);

    const names = [];
    for (const pair of formData.entries()) {
      if (pair[1] !== null) {
        if (pair[1] !== "") {
          globFormdata.append(pair[0], pair[1]);
          if (names.indexOf(pair[0]) === -1) {
            names.push(pair[0])
          }

        }

      }

    }


    for (const name of names) {
      let counter = 0;
      this.mainInstance.bone.querySelectorAll('[data-bone-name="' + name + '"]').forEach((element) => {
        if (this.boneStructure["multiple"]) {
          element.dataset.boneNameIndex = name + "." + counter;
        } else {
          element.dataset.boneNameIndex = name;
        }
        counter += 1;
      });


    }


    this.mainInstance.bone.querySelectorAll("form").forEach((form) => {
      console.log("search")


      if (form.dataset.depth === undefined) return;
      if (form.dataset.lang === undefined) return;


      formData = new FormData(form);

      if (depthCounter[Number.parseInt(form.dataset.depth)] === undefined) {
        depthCounter.push(0)
        langs.push(form.dataset.lang.toString());

      } else {

        let found = false;
        for (const pair_ of formData.entries()) {
          found = true;
          break;
        }
        if (found || form.querySelector("form")) {
          depthCounter[Number.parseInt(form.dataset.depth)] += 1;
          depthCounter.splice(Number.parseInt(form.dataset.depth) + 1)

        }

      }
      /**
       * Set Index on boneName for esaier error handling
       */
      form.querySelectorAll(":scope > div > sl-input").forEach((element) => {

        let key = element.dataset.boneName;
        let counter = 0;
        while (key.indexOf("$(index)") !== -1) {
          key = key.replace("$(index)", depthCounter[counter].toString());
          counter += 1;
        }
        element.dataset.boneNameIndex = key;
      })
      if (langs[Number.parseInt(form.dataset.depth)] !== form.dataset.lang) {

        langs[Number.parseInt(form.dataset.depth)] = form.dataset.lang
        depthCounter[Number.parseInt(form.dataset.depth)] = 0;
        depthCounter.splice(Number.parseInt(form.dataset.depth) + 1)


      }

      for (const pair of formData.entries()) {
        let key = pair[0]
        let counter = 0;
        while (key.indexOf("$(index)") !== -1) {
          key = key.replace("$(index)", depthCounter[counter].toString());
          counter += 1;
        }
        globFormdata.append(key, pair[1]);
      }


    })

    const obj = {}
    for (const pair of globFormdata.entries()) {
      createPath(obj, pair[0], pair[1]);
    }

    if (obj !== {}) {
      this.mainInstance.internboneValue = obj;
    }

    return globFormdata;


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

function createPath(obj: object, path: string | string[], value: any | null = null) {

  path = typeof path === 'string' ? path.split('.') : path;
  let current: object = obj;

  if (path.length > 1) {
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


  }


  if (current[path[0]] === undefined) {
    current[path[0]] = value;

  } else if (Array.isArray(current[path[0]])) {
    current[path[0]].push(value);
  } else {
    const tmp = JSON.parse(JSON.stringify(current[path[0]]));
    current[path[0]] = []
    current[path[0]] = [tmp, value]

  }


  return obj


}

function objectToPaths(obj: object, path: string) {

  let paths: string[] = [];
  const tmpObj: any | any[] = getPath(obj, path);
  if (Array.isArray(tmpObj)) {
    for (const tmp in tmpObj) {

      if (typeof tmpObj[tmp] === "object") {
        paths = paths.concat(objectToPaths(obj, path + "." + tmp));
      } else {
        paths = paths.concat(path);
      }
    }
  } else if (typeof (tmpObj) === "object") {
    for (const tmp in tmpObj) {

      paths = paths.concat(objectToPaths(obj, path + "." + tmp));
    }

  } else {

    paths.push(path);
  }

  return paths;

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
