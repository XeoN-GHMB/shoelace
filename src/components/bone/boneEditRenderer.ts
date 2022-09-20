import {escapeString, formatstring, getPath} from "./boneViewRenderer";
import SlBone from "./bone";
import SlCombobox from "../combobox/combobox";
import SlIcon from "../icon/icon";
import SlButton from "../button/button";
import SlIconButton from "../icon-button/icon-button";
import SlSelect from "../select/select";
import {emit} from "../../internal/event";
import SlDetails from "../details/details";
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


    wrapper.classList.add("bone-wrapper")
    wrapper.dataset.boneWrapper = "true";
    wrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    wrapper.dataset.boneName = this.boneName;
    if (this.mainInstance.renderLabel) {
      const boneNameLabel = document.createElement("div");
      boneNameLabel.innerText = this.boneStructure["descr"].length > 0 ? this.boneStructure["descr"] : this.boneName;
      wrapper.appendChild(boneNameLabel);
    }


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

        const languageWrapper = document.createElement("div");
        languageWrapper.classList.add("language-wrapper");

        if (this.boneStructure.multiple && this.boneStructure["type"] !== "select") {
          // Lang and Mul
          const multipleWrapper = document.createElement("div");
          multipleWrapper.classList.add("multiple-wrapper");
          let idx: number = 0;
          if (this.boneValue !== null) {

            for (const [i, tmpValue] of this.boneValue[lang].entries()) {

              console.log("add land", lang)
              multipleWrapper.appendChild(this.addInput(tmpValue, lang, i));
              multipleWrapper.appendChild(this.addErrorContainer(lang, i));


              idx += 1;
            }
          }
          const addButton = document.createElement("sl-button");

          addButton.addEventListener("click", () => {

            const obj = this.reWriteBoneValue();
            createPath(obj, this.generateboneName(lang, idx), this.boneStructure["emptyValue"]);
            console.log("obj", obj)
            this.mainInstance.boneValue = obj[this.mainInstance.boneName];

          });
          languageWrapper.appendChild(multipleWrapper);
          addButton.innerText = "Add";
          addButton.variant = "success";

          const clearButton = document.createElement("sl-button");
          clearButton.addEventListener("click", () => {
            multipleWrapper.innerHTML = "";//Clear Wrapper;
          });
          clearButton.innerText = "Clear";
          clearButton.id = "clearButton"
          clearButton.variant = "danger";
          clearButton.innerText = "Clear";
          const xicon: SlIcon = document.createElement("sl-icon");
          xicon.name = "x";
          xicon.slot = "suffix";
          clearButton.appendChild(xicon);
          //TODO icon prefix for add and clear
          clearButton.variant = "danger";


          tab_panel.appendChild(addButton);
          tab_panel.appendChild(clearButton);
          tab_panel.appendChild(languageWrapper);
        } else {
          //Lang , no multipler
          const languageWrapper = document.createElement("div");
          languageWrapper.classList.add("language-wrapper");
          languageWrapper.appendChild(this.addInput(this.boneValue[lang], lang));
          languageWrapper.appendChild(this.addErrorContainer(lang));


          tab_panel.appendChild(languageWrapper);
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
        const multipleWrapper = document.createElement("div");
        multipleWrapper.classList.add("multiple-wrapper");
        const addButton = document.createElement("sl-button");
        addButton.innerText = "Add";
        addButton.variant = "success"
        let idx: number = 0;
        for (const [i, tmpValue] of this.boneValue.entries()) {
          multipleWrapper.appendChild(this.addInput(tmpValue, null, i));
          multipleWrapper.appendChild(this.addErrorContainer(null,i));

          idx += 1;
          //TODo for later item moving
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


        }


        addButton.addEventListener("click", () => {
          const obj = this.reWriteBoneValue();
          createPath(obj, this.generateboneName(null, idx), this.boneStructure["emptyValue"]);
          this.mainInstance.boneValue = obj[this.mainInstance.boneName];


        });

        wrapper.appendChild(addButton);
        const clearButton = document.createElement("sl-button");
        clearButton.addEventListener("click", () => {
          multipleWrapper.innerHTML = "";//Clear Wrapper;
        });
        clearButton.innerText = "Clear";
        clearButton.variant = "danger";
        wrapper.appendChild(clearButton);

        wrapper.appendChild(multipleWrapper);


      } else {
        //No Lang, No Multiple

        const inputElement = this.getEditor(this.boneValue, this.boneName)
        inputElement.dataset.lang = "null";
        inputElement.dataset.multiple = this.boneStructure["multiple"];

        wrapper.appendChild(inputElement);
        wrapper.appendChild(this.addErrorContainer());


      }
    }
    wrapper.addEventListener("sl-focus", (focus_event) => {

      this.blurCounter += 1;


    });
    wrapper.addEventListener("sl-blur", (blur_event) => {

      this.blurCounter -= 1;
      return
      const self: BoneEditRenderer = this;
      setTimeout(function () {

        if (self.blurCounter === 0) {
          const formData = self.reWriteBoneValue();
          self.mainInstance.handleChange(formData);


        }
      }, 20)
    });
    if (!fromRecord) {
      if (this.mainInstance.rendersaveButton) {
        const saveButton = document.createElement("sl-button");
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", () => {
          console.log("Save")
          const formData = this.reWriteBoneValue();
          this.mainInstance.handleChange(formData);
        })
        wrapper.appendChild(saveButton);
      }


    }

    return wrapper;


  }

  generateboneName(lang = null, index = null) {
    let newboneName = this.boneName;
    if (lang !== null) {

      newboneName += "." + lang.toString();
    }
    if (index !== null) {
      newboneName += "." + index.toString();
    }
    return newboneName;
  }

  addInput(value: any, lang: string, index = null) {

    const newboneName = this.generateboneName(lang, index);

    const inputElement: HTMLElement = this.getEditor(value, newboneName);
    inputElement.dataset.lang = lang;
    inputElement.dataset.multiple = this.boneStructure["multiple"];

    if (this.boneStructure["multiple"]) {
      inputElement.querySelector(":scope>#clearButton").addEventListener("click", () => {
        const obj = this.reWriteBoneValue();
        createPath(obj, newboneName, null, true);
        this.mainInstance.boneValue = obj[this.mainInstance.boneName];


        //this.mainInstance.handleChange(formData, "deleteEntry")
        //addButton.focus();

      });
    }
    return inputElement;
  }
  addErrorContainer( lang: string, index = null):SlDetails
  {
    const errorContainer:SlDetails = document.createElement("sl-details");
    errorContainer.dataset.name=this.generateboneName(lang, index)+"_errorcontainer";
    errorContainer.style.display="none";
    errorContainer.summary="Errors";
    errorContainer.classList.add("error-container");
    return errorContainer;

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

      case "spatial":
        return this.spatialBoneEditorRenderer(value, boneName);
      default:
        return this.rawBoneEditorRenderer(value, boneName);
    }

  }


  rawBoneEditorRenderer(value: any, boneName = "") {
    const inputElement = document.createElement("sl-input");
    //const clearButton: SlIconButton = document.createElement("sl-icon-button")
    if (this.boneStructure["multiple"]) {

      const clearButton: SlButton = document.createElement("sl-button")
      clearButton.id = "clearButton"
      clearButton.variant = "danger";
      clearButton.innerText = "Delete";
      clearButton.slot = "suffix";
      const xicon: SlIcon = document.createElement("sl-icon");
      xicon.name = "x";
      xicon.slot = "prefix";
      clearButton.appendChild(xicon);
      inputElement.appendChild(clearButton);
    }

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
    inputElement.addEventListener("sl-change", (change_event) => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });

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
        if (inputElement.reportValidity()) {
          this.mainInstance.internboneValue = this.reWriteBoneValue();
          this.mainInstance.handleChange();
        }


      } else {
        //this.mainInstance.bone.querySelector("sl-input").setCustomValidity("Please Fill");

        inputElement.setCustomValidity("Please Fill");


      }

    })

    return inputElement;
  }

  stringBoneEditorRenderer(value: any, boneName = "") {
    //Replace Encoded chars

    return this.rawBoneEditorRenderer(escapeString(value), boneName);
  }


  numericBoneEditorRenderer(value: any, boneName = "") {

    const numericBone = this.rawBoneEditorRenderer(value, boneName);
    numericBone.type = "number";
    numericBone.min = this.boneStructure["min"];
    numericBone.max = this.boneStructure["max"];
    if (this.boneStructure["precision"] > 1) {
      numericBone.step = "0." + "0".repeat(this.boneStructure["precision"] - 1) + "1";
    }

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

    const recordboneWrapper = document.createElement("form");
    recordboneWrapper.classList.add("record-wrapper");
    recordboneWrapper.style.paddingTop = "5px";
    recordboneWrapper.style.paddingLeft = "5px";

    recordboneWrapper.style.marginTop = "2px";
    recordboneWrapper.style.marginLeft = "2px";

    recordboneWrapper.style.borderStyle = "solid";
    recordboneWrapper.style.borderWidth = "1px";
    //TODo outsource styles

    recordboneWrapper.dataset.boneName = this.boneName;
    recordboneWrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    recordboneWrapper.dataset.depth = this.depth.toString();


    for (const [_boneName, _boneStructure] of Object.entries(this.boneStructure["using"])) {

      let recordBoneValue: any = null;
      if (value !== null) {
        recordBoneValue = value[_boneName];

      }


      const newBoneName = boneName + "." + _boneName;
      const tmp_renderer = new BoneEditRenderer(_boneStructure, recordBoneValue, newBoneName, this.mainInstance)
      const tmp: HTMLElement = tmp_renderer.boneEditor(true, this.depth + 1);
      tmp.dataset.fromRecord = "true";

      recordboneWrapper.appendChild(tmp);
    }
    if (this.boneStructure["multiple"]) {
      const clearButton: SlButton = document.createElement("sl-button")

      clearButton.id = "clearButton"
      clearButton.variant = "danger";
      clearButton.innerText = "Delete";
      const xicon: SlIcon = document.createElement("sl-icon");
      xicon.name = "x";
      xicon.slot = "prefix";
      clearButton.appendChild(xicon);

      //clearButton.style.float="right";
      recordboneWrapper.appendChild(clearButton);
    }
    recordboneWrapper.addEventListener("submit", (e) => {

      e.preventDefault()
    })
    return recordboneWrapper;


  }


  relationBoneEditorRenderer(value: any, boneName = "") {

    const inputWrapper = document.createElement("div");
    const shadowInput = document.createElement("input")
    const searchBox: SlCombobox = document.createElement("sl-combobox");

    const clearButton: SlIconButton = document.createElement("sl-icon-button")
    clearButton.library = "my-icons";
    clearButton.slot = "suffix";
    clearButton.name = "x-circle";
    clearButton.id = "clearButton"
    searchBox.appendChild(clearButton);

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
                value: d.key
              };

            })
          }
        );
    };
    inputWrapper.appendChild(shadowInput);
    inputWrapper.appendChild(searchBox);

    searchBox.addEventListener("sl-item-select", (e: CustomEvent) => {

      shadowInput.value = e.detail.item.value;
      //const formData = this.reWriteBoneValue();
      //this.mainInstance.internboneValue[this.boneName] = {dest: JSON.parse(e.detail.item.value)}
      //this.mainInstance.handleChange(formData);

    });

    return inputWrapper;


  }


  fileBoneEditorRenderer(value: any, boneName = "") {


    const fileContainer = document.createElement("div")
    const shadowFile = document.createElement("input");
    const shadowKey = document.createElement("input");
    const statusSpan = document.createElement("span");
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

    shadowFile.addEventListener("change", (e: Event) => {

      const file: File = e.target.files[0];
      getUploadUrl(file).then(uploadData => {

        statusSpan.innerText = "Uploading..."
        uploadFile(file, uploadData).then(resp => {


          addFile(uploadData, statusSpan).then((fileData: object) => {
            const fileKey: string = fileData["values"]["key"];
            shadowKey.value = fileKey;
            statusSpan.innerText = fileKey;
            //const formData = this.reWriteBoneValue();
            //this.mainInstance.handleChange(formData);

          })

        });
      });
    });

    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(shadowKey);
    fileContainer.appendChild(statusSpan);
    fileContainer.appendChild(uploadButton);
    fileContainer.appendChild(clearButton);
    return fileContainer;
  }


  selectBoneEditorRenderer(value: any, boneName = "") {

    const inputSelect: SlSelect = document.createElement("sl-select");

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
      //this.mainInstance.handleChange(formData);
    });

    return inputSelect;

  }

  spatialBoneEditorRenderer(value: any, boneName = "") {
    const spatialWrapper = document.createElement("div");
    const lat = value[0];
    const lng = value[1];

    const latInput = this.rawBoneEditorRenderer(lat, boneName + ".lat");
    latInput.type = "number";

    latInput.min = this.boneStructure["boundsLat"][0];
    latInput.max = this.boneStructure["boundsLat"][1];
    latInput.step = "any";
    spatialWrapper.appendChild(latInput);

    const lngInput = this.rawBoneEditorRenderer(lng, boneName + ".lng");
    lngInput.type = "number";
    lngInput.min = this.boneStructure["boundsLng"][0];
    lngInput.max = this.boneStructure["boundsLng"][1];
    lngInput.step = "any";
    spatialWrapper.appendChild(lngInput);
    return spatialWrapper;
  }

  reWriteBoneValue() {
    const obj = {};
    this.mainInstance.bone.querySelectorAll("sl-input").forEach((inputElement) => {

      createPath(obj, inputElement.name, inputElement.value);

    });
    return obj;
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

function createPath(obj: object, path: string | string[], value: any | null = null, mustdelete = false) {

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
    current[path[0]] = value;
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

function

addFile(uploadData: any) {


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
