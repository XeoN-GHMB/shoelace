import {formatstring} from "./boneViewRenderer";
//const apiurl=window.location.origin;
const apiurl = "http://localhost:8080";

export class BoneEditRenderer {
  boneStructure: any;
  boneValue: any;
  boneName: string;
  mainInstance: any;
  boneRenderer = {"str": this.stringBoneEditorRenderer};

  constructor(boneStructure: any, boneValue: any, boneName: any, mainInstance: any) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }


  boneEditor(boneName = ""): any {
  if(boneName==="")
  {
    boneName=this.boneName;
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
        if (this.boneStructure["multiple"]) {
          const inputWrapper = document.createElement("div");
          let index = 0;
          for (const tmpValue of this.boneValue[lang]) {

            const newboneName = boneName + "." + lang + "." + index;
            const inputElement = this.getEditor(tmpValue, lang, newboneName);
            inputWrapper.appendChild(inputElement);
            index += 1;
          }

          const addButton = document.createElement("sl-button");

          addButton.addEventListener("click", () => {
            //const newboneName = boneName //FIXME RECORD BONE
            const newboneName = boneName + "." + lang + "." + index;
            const inputElement = this.getEditor("", null, newboneName);

            inputWrapper.insertBefore(inputElement, addButton);

            index += 1;
          });
          addButton.innerText = "Add";
          inputWrapper.appendChild(addButton);
          tab_panel.appendChild(inputWrapper);

        } else {
          //Lang , no multipler
          const newboneName = boneName + "." + lang;
          const inputElement = this.getEditor(this.boneValue[lang], lang, newboneName);

          tab_panel.appendChild(inputElement);
        }
        tabGroup.appendChild(tab_panel);


      }
      return tabGroup;

    } else {

      if (this.boneStructure["multiple"] && this.boneStructure["type"] !== "select") {
        //No Lang , Multiple
        const inputWrapper = document.createElement("div");
        inputWrapper.dataset.boneName = boneName;
        if (this.boneValue === null) {
          this.boneValue = []
        }
        let  index=0;
        for (const tmpValue of this.boneValue) {
          const newboneName =  boneName + "." + index;
          const boneWrapper = document.createElement("div");

          const inputElement = this.getEditor(tmpValue, null, newboneName);


          const deleteButton = document.createElement("sl-button");
          deleteButton.innerText = "X";
          deleteButton.addEventListener("click", () => {
            boneWrapper.outerHTML = "";


          });
          boneWrapper.appendChild(inputElement);
          boneWrapper.appendChild(deleteButton);
          inputWrapper.appendChild(boneWrapper);
          index+=1;
        }
        const addButton = document.createElement("sl-button");

        addButton.addEventListener("click", () => {
          const newboneName =  boneName + "." + index; //FIXME RECORD BONE
          const inputElement = this.getEditor("", null, newboneName);

          inputWrapper.insertBefore(inputElement, addButton);
          index+=1;

        });
        addButton.innerText = "Add";
        inputWrapper.appendChild(addButton);


        return inputWrapper;
      } else {
        //No Lang, No Multiple
        const inputWrapper = document.createElement("div");
        inputWrapper.appendChild(this.getEditor(this.boneValue, null, this.boneName));
        return inputWrapper;


      }
    }


  }


  getEditor(value: any, lang = null, boneName = "") {
    switch (this.boneStructure["type"].split(".")[0]) {
      case "str":
        return this.stringBoneEditorRenderer(value, lang, boneName);
      case "numeric":
        return this.numericBoneEditorRenderer(value, lang, boneName);
      case "date":
        return this.dateBoneEditorRenderer(value, lang, boneName);
      case "bool":
        return this.booleanBoneEditorRenderer(value, lang, boneName);
      case "record":
        return this.recordBoneEditorRenderer(value, lang, boneName);
      case "relational":
        if (this.boneStructure["type"].startsWith("relational.tree.leaf.file")) {
          return this.fileBoneEditorRenderer(value, lang, boneName);
        }
        return this.relationBoneEditorRenderer(value, lang, boneName);
      case "select":
        return this.selectBoneEditorRenderer(value, lang, boneName);
      default:
        return this.rawBoneEditorRenderer(value, lang, boneName);
    }

  }


  rawBoneEditorRenderer(value: any, lang = null, boneName = "") {
    const inputElement = document.createElement("sl-input");
    inputElement.dataset.boneName = boneName;
    inputElement.value = value;
    if (lang !== null) {
      inputElement.dataset.lang = lang;
    }
    inputElement.addEventListener("sl-change", (change_event) => {
    createPath(this.mainInstance.internboneValue,boneName,inputElement.value)
    this.mainInstance.handleChange();

      console.log(this.mainInstance.internboneValue);
    })

    return inputElement;
  }

  stringBoneEditorRenderer(value: any, lang = null, boneName = "") {

    return this.rawBoneEditorRenderer(value, lang, boneName);
  }


  numericBoneEditorRenderer(boneStructure: any, value: any, lang = null, boneName = "") {

    const numericBone = rawBoneEditorRenderer(boneStructure, value, lang, boneName);
    numericBone.type = "number";
    numericBone.min = boneStructure["min"];
    numericBone.max = boneStructure["max"];
    return numericBone;
  }


  dateBoneEditorRenderer(boneStructure: any, value: any, lang = null, boneName = "") {

    const dateBone = rawBoneEditorRenderer(boneStructure, value, lang, boneName);

    if (boneStructure["time"]) {

      dateBone.type = "datetime-local"
      dateBone.value = value.split('+')[0]
    } else {
      dateBone.type = "date"
      dateBone.value = (new Date(value)).toISOString().substr(0, 10);
    }


    return dateBone;
  }


  booleanBoneEditorRenderer(boneStructure: any, value: any, lang = null, boneName = "") {

    const inputElement = document.createElement("sl-switch");
    inputElement.dataset.boneName = boneName;
    inputElement.value = value;
    if (lang !== null) {
      inputElement.dataset.lang = lang;
    }

    return inputElement;
  }


  recordBoneEditorRenderer(value: any, lang = null, boneName = "") {


    const inputWrapper = document.createElement("div");


    for (const bone of this.boneStructure["using"]) {
      const recordBoneName = bone[0];
      const recordBoneStructure = bone[1];
      const recordBoneValue = value[bone[0]];

      const newBoneName = boneName + "." + recordBoneName;
      const tmp_renderer = new BoneEditRenderer(recordBoneStructure,  recordBoneValue,newBoneName,this.mainInstance)
      const tmp = tmp_renderer.boneEditor();
      console.log(tmp);
      tmp.dataset.fromRecord = "true";


      inputWrapper.appendChild(tmp);
    }
    return inputWrapper;


  }


  relationBoneEditorRenderer(boneStructure: any, value: any, lang = null, boneName = "") {

    const inputWrapper = document.createElement("div");

    const searchBox = document.createElement("sl-combobox");
    //searchBox.hoist =true
    const url = `${apiurl}/json/country/list?search={q}`;


    //searchBox.style.width = "100%";
    //searchBox.style.boxSizing = "border-box";
    searchBox.dataset.boneName = boneName;
    console.log(value);
    searchBox.dataset.boneValue = value["dest"]["key"];

    searchBox.source = (search) => {
      return fetch(url.replace('{q}', search))
        .then(res => res.json())
        .then((data) => {

            const skellist = data["skellist"]
            return skellist.map((d: any) => {
              return {
                text: formatstring({dest: d}, boneStructure),
                value: d.key
              };

            })
          }
        );
    };
    inputWrapper.appendChild(searchBox);

    searchBox.addEventListener("sl-item-select", (e: CustomEvent) => {

      searchBox.dataset.boneValue = e.detail.item.__value;
      updateRelationalBone(searchBox, cell, success)
    });

    return inputWrapper;


  }


  fileBoneEditorRenderer(boneStructure: any, value: any, lang = null, boneName = "") {


    const fileContainer = document.createElement("div")
    const shadowFile = document.createElement("input");
    const statusSpan = document.createElement("span");
    shadowFile.type = "file";
    let filter: string;

    if (boneStructure["validMimeTypes"] !== null) {
      if (boneStructure["validMimeTypes"].indexOf("*") == -1) {
        filter = boneStructure["validMimeTypes"].join(",")
      } else {
        filter = "*";
      }

    } else {
      filter = "*";
    }

    shadowFile.accept = filter;
    shadowFile.hidden = true;
    shadowFile.addEventListener("change", (e: any) => {
      const target = e.target;
      const file = e.target.files[0];
      getUploadUrl(file).then(uploadData => {

        const parent = target.parentElement;
        const inputspan = parent.querySelector("span");
        inputspan.innerText = "Uploading..."
        uploadFile(file, uploadData).then(resp => {

          const inputName = parent.dataset["name"];
          const keyinput = parent.querySelector('[name="' + inputName + '"]');

          addFile(uploadData, keyinput, inputspan, file).then((fileData: any) => {
            const fileKey: string = fileData["values"]["key"];
            const skelKey = "cell._cell.row.data.key"//FixMe;
            const formData = new FormData();
            formData.append(boneName, fileKey);
            updateData(formData, skelKey).then((newBoneData: any) => {

              //cell.setValue(newBoneData["values"][boneName]); // We must set the cell by hand because double focus.//FixMe;

            });
          })

        });
      });
    });
    shadowFile.click();
    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(statusSpan);
    return fileContainer;
  }


  selectBoneEditorRenderer(boneStructure: any, value: any, lang = null, boneName = "") {

    const inputSelect = document.createElement("sl-select");

    inputSelect.style.width = "100%";
    inputSelect.style.boxSizing = "border-box";


    inputSelect.multiple = boneStructure["multiple"]
    inputSelect.dataset.boneName = boneName

    inputSelect.value = value;


  }
}

/////////////////HELPER FUNCTRIONS/////////////////
function getSkey() {
  return new Promise((resolve, reject) => {
    fetch(`${apiurl}/json/skey`).then(response => response.json()).then((skey) => {
      resolve(skey)
    })

  })
}
function createPath(obj: any, path: any, value = null) {

  path = typeof path === 'string' ? path.split('.') : path;
  const orgiPath=path;
  let current = obj;
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


  if (Number.isNaN(parseInt(path[0]))) {
    current[path[0]] = value;
  } else {
    if(current===null)
    {
     obj = createPath(obj,orgiPath.slice(0,orgiPath.length-1),[])
     obj = createPath(obj,orgiPath,value)
    }
    else
    {
     current[parseInt(path[0])] = value;
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

function uploadFile(file, uploadData) {

  return new Promise((resolve, reject) => {
    fetch(uploadData["values"]["uploadUrl"], {
      method: "POST",
      body: file,
      mode: "no-cors",

    }).then(response => {
      resolve(response)
    })
  })

}

function addFile(uploadData, keyinput, inputSpan, file) {

  const currentUpload: any = {}
  return new Promise((resolve, reject) => {
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
