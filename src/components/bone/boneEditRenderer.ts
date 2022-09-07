import {formatstring, getPath} from "./boneViewRenderer";
//const apiurl=window.location.origin;
const apiurl = "http://localhost:8080";

export class BoneEditRenderer {
  blurCounter = 0;
  boneStructure: any;
  boneValue: any;
  boneName: string;
  mainInstance: any;
  boneRenderer = {"str": this.stringBoneEditorRenderer};
  depth = 0;

  constructor(boneStructure: any, boneValue: any, boneName: any, mainInstance: any) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }


  boneEditor(fromRecord = false, depth = null): any {
    if (depth !== null) {
      this.depth = depth;
    }

    let wrapper: any;
    if (fromRecord) {
      wrapper = document.createElement("div");

    } else {
      wrapper = document.createElement("form");

      wrapper.addEventListener("submit", (e) => {
        e.preventDefault()
      })
    }


    wrapper.dataset.boneWrapper = "true";
    wrapper.dataset.multiple = this.boneStructure["multiple"];
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
        if (this.boneStructure["multiple"]) {
          const inputWrapper = document.createElement("div");
          let index = 0;
          for (const tmpValue of this.boneValue[lang]) {
            let newboneName = this.boneName;
            if (this.boneStructure["type"] === "record") {
              newboneName = this.boneName + "." + lang + ".$(index)";
            }

            const inputElement = this.getEditor(tmpValue, lang, newboneName);
            inputWrapper.appendChild(inputElement);
            index += 1;
          }

          const addButton = document.createElement("sl-button");

          addButton.addEventListener("click", () => {
            //const newboneName = boneName //FIXME RECORD BONE

            const newboneName = this.boneName + "." + lang + "." + index;
            const inputElement = this.getEditor("", null, newboneName);

            inputWrapper.insertBefore(inputElement, addButton);

            index += 1;
          });
          addButton.innerText = "Add";
          inputWrapper.appendChild(addButton);
          tab_panel.appendChild(inputWrapper);

        } else {
          //Lang , no multipler
          const newboneName = this.boneName + "." + lang;
          const inputElement = this.getEditor(this.boneValue[lang], lang, newboneName);

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
        let index = 0;
        const addButton = document.createElement("sl-button");
        for (const tmpValue of this.boneValue) {
          let newboneName = this.boneName;
          if (this.boneStructure["type"] === "record") {
            newboneName = this.boneName + ".$(index)";
          }


          const boneWrapper = document.createElement("div");

          const inputElement: any = this.getEditor(tmpValue, null, newboneName);


          const deleteButton = document.createElement("sl-button");

          deleteButton.innerText = "X";
          deleteButton.addEventListener("click", () => {
            //this.blurCounter+=1;
            this.reWriteBoneValue()
            boneWrapper.remove();
            addButton.focus();
            /*wrapper.querySelectorAll("sl-input").forEach((inElement)=>{
              console.log(inElement);
            })*/


          });
          boneWrapper.appendChild(inputElement);
          boneWrapper.appendChild(deleteButton);
          wrapper.appendChild(boneWrapper);
          index += 1;
        }


        addButton.addEventListener("click", () => {
          let newboneName = this.boneName; //FIXME RECORD BONE


          const inputElement = this.getEditor("", null, newboneName);

          wrapper.insertBefore(inputElement, addButton);

          wrapper.focus();
          index += 1;

        });
        addButton.innerText = "Add";
        wrapper.appendChild(addButton);


      } else {
        //No Lang, No Multiple

        wrapper.appendChild(this.getEditor(this.boneValue, null, this.boneName));


      }
    }
    wrapper.addEventListener("sl-focus", (focus_event) => {

      this.blurCounter += 1;


    });
    wrapper.addEventListener("sl-blur", (blur_event) => {

      this.blurCounter -= 1;

      var self = this;
      setTimeout(function () {

        if (self.blurCounter === 0) {
          return
          console.log("send")


          wrapper.querySelectorAll("sl-input").forEach((inputElement) => {

            createPath(self.mainInstance.internboneValue, inputElement.dataset.boneName, inputElement.value);
          });

          const formData = new FormData();
          const tmpPaths = new Set(objectToPaths(self.mainInstance.internboneValue, self.mainInstance.boneName));
          tmpPaths.forEach((path: string) => {
            const tmpValue = getPath(self.mainInstance.internboneValue, path)
            if (Array.isArray(tmpValue)) {
              for (const val of tmpValue) {
                formData.append(path, val);
              }
            } else {
              formData.append(path, tmpValue);

            }

          })


          self.mainInstance.handleChange(formData);
        }
      }, 20)
    });

    return wrapper;


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
    inputElement.name = boneName;
    inputElement.value = value;
    if (lang !== null) {
      inputElement.dataset.lang = lang;
    }

    inputElement.addEventListener("keypress", (keypress_event) => {

      if (keypress_event.key !== "Enter") return;

      const formData = this.reWriteBoneValue();

      this.mainInstance.handleChange(formData);
    })

    return inputElement;
  }

  stringBoneEditorRenderer(value: any, lang = null, boneName = "") {

    return this.rawBoneEditorRenderer(value, lang, boneName);
  }


  numericBoneEditorRenderer(value: any, lang = null, boneName = "") {

    const numericBone = this.rawBoneEditorRenderer(value, lang, boneName);
    numericBone.type = "number";
    numericBone.min = this.boneStructure["min"];
    numericBone.max = this.boneStructure["max"];
    return numericBone;
  }


  dateBoneEditorRenderer(value: any, lang = null, boneName = "") {

    const dateBone = this.rawBoneEditorRenderer(value, lang, boneName);

    if (this.boneStructure["time"]) {

      dateBone.type = "datetime-local"
      dateBone.value = value.split('+')[0]
    } else {
      dateBone.type = "date"
      dateBone.value = (new Date(value)).toISOString().substr(0, 10);
    }


    return dateBone;
  }


  booleanBoneEditorRenderer(value: any, lang = null, boneName = "") {

    const inputElement = document.createElement("sl-switch");
    inputElement.dataset.boneName = boneName;
    inputElement.value = value;
    if (lang !== null) {
      inputElement.dataset.lang = lang;
    }

    return inputElement;
  }


  recordBoneEditorRenderer(value: any, lang = null, boneName = "") {


    const inputWrapper = document.createElement("form");
    inputWrapper.dataset.boneName = this.boneName;
    inputWrapper.dataset.multiple = this.boneStructure["multiple"];
    inputWrapper.dataset.depth = this.depth;
    inputWrapper.dataset.lang = lang;


    for (const bone of this.boneStructure["using"]) {
      const recordBoneName = bone[0];
      const recordBoneStructure = bone[1];
      const recordBoneValue = value[bone[0]];

      const newBoneName = boneName + "." + recordBoneName;
      const tmp_renderer = new BoneEditRenderer(recordBoneStructure, recordBoneValue, newBoneName, this.mainInstance)
      const tmp = tmp_renderer.boneEditor(true, this.depth + 1);
      tmp.dataset.fromRecord = "true";


      inputWrapper.appendChild(tmp);
    }
    inputWrapper.addEventListener("submit", (e) => {
      e.preventDefault()
    })
    return inputWrapper;


  }


  relationBoneEditorRenderer(value: any, lang = null, boneName = "") {

    const inputWrapper = document.createElement("div");

    const searchBox = document.createElement("sl-combobox");
    //searchBox.hoist =true
    const url = `${apiurl}/json/country/list?search={q}`;


    //searchBox.style.width = "100%";
    //searchBox.style.boxSizing = "border-box";
    searchBox.dataset.boneName = boneName;
    searchBox.dataset.boneValue = value["dest"]["key"];

    searchBox.source = (search) => {
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
    inputWrapper.appendChild(searchBox);

    searchBox.addEventListener("sl-item-select", (e: CustomEvent) => {

      searchBox.dataset.boneValue = e.detail.item.__value;
      //updateRelationalBone(searchBox, cell, success)
    });

    return inputWrapper;


  }


  fileBoneEditorRenderer(value: any, lang = null, boneName = "") {


    const fileContainer = document.createElement("div")
    const shadowFile = document.createElement("input");
    const statusSpan = document.createElement("span");
    shadowFile.type = "file";
    let filter: string;

    if (this.boneStructure["validMimeTypes"] !== null) {
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
            /*updateData(formData, skelKey).then((newBoneData: any) => {

              //cell.setValue(newBoneData["values"][boneName]); // We must set the cell by hand because double focus.//FixMe;

            });*/
          })

        });
      });
    });
    shadowFile.click();
    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(statusSpan);
    return fileContainer;
  }


  selectBoneEditorRenderer(value: any, lang = null, boneName = "") {

    const inputSelect = document.createElement("sl-select");

    inputSelect.multiple = this.boneStructure["multiple"]
    inputSelect.dataset.boneName = boneName

    inputSelect.value = value;


  }


  reWriteBoneValue() {
    let globFormdata = new FormData();
    let depthCounter = [];
    let langs = [];
    let data = new FormData(this.mainInstance.bone);
    for (const pair of data.entries()) {

      globFormdata.append(pair[0], pair[1])
    }

    let langBefor = "";
    this.mainInstance.bone.querySelectorAll("form").forEach((form) => {


      let formData = new FormData(form);

      if (depthCounter[form.dataset.depth] === undefined) {
        depthCounter.push(0)
        langs.push(form.dataset.lang);

      } else {

        let found:boolean = false;
        for (const pair of formData.entries()) {
          found = true;
          break;
        }
        if(found||form.querySelector("form"))
        {
          depthCounter[Number.parseInt(form.dataset.depth)] += 1;
          depthCounter.splice(Number.parseInt(form.dataset.depth) + 1)
          console.log("depth set up")
          console.log(depthCounter)
        }

      }
      if (langs[Number.parseInt(form.dataset.depth)] !== form.dataset.lang) {

        langs[Number.parseInt(form.dataset.depth)] = form.dataset.lang
        depthCounter[Number.parseInt(form.dataset.depth)] = 0;
        depthCounter.splice(Number.parseInt(form.dataset.depth) + 1)



      }

      for (var pair of formData.entries()) {
        var key = pair[0]
        let counter = 0;
        while (key.indexOf("$(index)") !== -1) {
          key = key.replace("$(index)", depthCounter[counter]);
          counter += 1;
        }
        globFormdata.append(key, pair[1]);
      }


    })

    var obj = {}
    for (var pair of globFormdata.entries()) {
      createPath(obj, pair[0], pair[1]);
    }
    console.log(obj);
    this.mainInstance.internboneValue=obj;
    return globFormdata;


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
  console.log(path)
  console.log(JSON.parse(JSON.stringify(obj)))
  path = typeof path === 'string' ? path.split('.') : path;
  let current: any = obj;

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

function objectToPaths(obj, path) {

  let paths = [];
  const tmpObj = getPath(obj, path);
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
