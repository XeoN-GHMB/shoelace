import {RawBone} from "./rawBone";
import {html, TemplateResult} from "lit";
import {formatstring, getSkey, apiurl, createPath, getPath} from "../utils";

export class FileBone extends RawBone {


  view(): string | TemplateResult<1> {
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

    return super.view(appendImage);
  }

  getEditor(value: any, boneName: string, lang: any = null): HTMLElement {


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
    fileContainer.classList.add("file-container")
    fileContainer.dataset.boneName = boneName;

    const shadowFile = document.createElement("input");
    const shadowKey = document.createElement("sl-input");
    const fileNameInput = document.createElement("sl-input");
    const uploadButton = document.createElement("sl-button");
    const clearButton = document.createElement("sl-button");
    const uploadIcon = document.createElement("sl-icon");
    const clearIcon = document.createElement("sl-icon");
    const progressBar = document.createElement("sl-progress-bar")

    uploadIcon.setAttribute("name", "file-earmark-arrow-up")
    uploadButton.appendChild(uploadIcon);
    uploadButton.setAttribute("variant", "success")
    uploadButton.setAttribute("outline", "")
    uploadButton.classList.add("upload-button")
    uploadButton.addEventListener("click", () => {
      shadowFile.click();
    })

    clearIcon.setAttribute("name", "x")
    clearButton.appendChild(clearIcon);
    clearButton.setAttribute("variant", "danger")
    clearButton.setAttribute("outline", "")
    clearButton.classList.add("clear-button")
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

    shadowFile.multiple = this.boneStructure["multiple"];
    const path = lang === null ? this.boneName : this.boneName + "." + lang;

    shadowFile.addEventListener("change", async (e: Event) => {
      const fileInfos = e.target.files;
      const fileKeys = [];
      fileNameInput.hidden = true;
      progressBar.hidden = false;

      console.log(progressBar)
      for (let i = 0; i < fileInfos.length; i++) {
        if (i > 0) {
          progressBar.value = (i / fileInfos.length) * 100;
        } else {
          progressBar.value = 0;

        }
        progressBar.textContent = `${progressBar.value}%`;

        const fileData = await this.fileUpload(fileInfos[i])
        this.mainInstance.relationalCache[fileData["values"]["key"]] = {dest: fileData["values"]}

        if (!this.boneStructure["multiple"]) {
          shadowKey.value = fileData["values"]["key"];
          fileNameInput.value = fileData["values"]["name"];
          const obj = this.reWriteBoneValue();
          this.mainInstance.internboneValue = obj;
          this.mainInstance.handleChange();
        } else {
          console.log("add ", fileData["values"]["key"])
          fileKeys.push(fileData["values"]["key"]);

        }
      }
      if (this.boneStructure["multiple"]) {
        shadowKey.value = fileKeys.shift();
        let boneValues = this.reWriteBoneValue();
        boneValues = getPath(boneValues, path);
        boneValues = boneValues.concat(fileKeys);
        const obj = {};
        createPath(obj, path, boneValues);
        const mulWrapper: HTMLElement = this.mainInstance.bone.querySelector('[data-multiplebone="' + path + '"]');

        if (mulWrapper !== null) {
          let [element, index] = this.createMultipleWrapper(getPath(obj, path), lang);
          mulWrapper.replaceWith(element);
          this.mainInstance.internboneValue = this.reWriteBoneValue();
          this.mainInstance.handleChange();
        }


      }

    });
    //fileNameInput
    fileNameInput.disabled = true;
    fileNameInput.addEventListener("click", () => {
      shadowFile.click();
    })
    if (value !== null && value !== "") { //Fixme why ==""
      try {
        fileNameInput.value = this.mainInstance.relationalCache[value]["dest"]["name"];
      } catch (e) {
        console.log("erorr in file value", value);
      }

    }
    progressBar.hidden = true;
    progressBar.classList.add("progress-bar-values");

    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(shadowKey);
    fileContainer.appendChild(fileNameInput);
    fileContainer.appendChild(progressBar);

    fileContainer.appendChild(uploadButton);
    fileContainer.appendChild(clearButton);
    return fileContainer;
  }

  fileUpload(file: File) {
    return new Promise((resolve, reject) => {
      FileBone.getUploadUrl(file).then(uploadData => {
        FileBone.uploadFile(file, uploadData).then(resp => {
          FileBone.addFile(uploadData).then((fileData: object) => {
            resolve(fileData);
          })
        })
      })
    });
  }


  static getUploadUrl(file: File) {
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

  static uploadFile(file: File, uploadData: any) {

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

  static addFile(uploadData: any) {


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


}

