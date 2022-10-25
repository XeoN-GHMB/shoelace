// @ts-nocheck
import {FileSkelValues, UploadUrlResponse} from "../interfaces";
import {html, TemplateResult} from "lit";
import {formatstring, getSkey, apiurl, createPath, getPath, translate} from "../utils";
import {BoneValue, RawBone} from "./rawBone";

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

  getEditor(value: string | Record<string, FileSkelValues>, boneName: string, lang: null|string = null): HTMLElement {


    /**
     * value can be :
     * null if a empty bone is renderd (multiple add)
     * key if we are in a add an we extend a multiple value
     * {dest:{name:"bla",key:"blablakey"}}
     *
     *
     */
    let key = "";
    if (typeof (value) === "object" && value !== null) {
      if ("dest" in value) {
        key = value["dest"]["key"];
        this.mainInstance.relationalCache[key] = value;

      }
    } else {
      key = value;
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
    uploadButton.title = translate("actions.addFile");
    uploadButton.addEventListener("click", () => {
      shadowFile.click();
    })

    clearIcon.setAttribute("name", "x")
    clearButton.appendChild(clearIcon);
    clearButton.setAttribute("variant", "danger")
    clearButton.setAttribute("outline", "")
    clearButton.classList.add("clear-button")
    clearButton.title = translate("actions.delete");
    clearButton.id = "clearButton";
    shadowFile.type = "file";
    let filter: string;

    if (this.boneStructure["validMimeTypes"] !== null && this.boneStructure["validMimeTypes"] !== undefined) {
      if (this.boneStructure["validMimeTypes"].indexOf("*") === -1) {
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
      shadowKey.value = key.toString();
    }

    shadowFile.multiple = this.boneStructure["multiple"];
    const path = lang === null ? this.boneName : `${this.boneName}.${lang.toString()}`;

    shadowFile.addEventListener("change", async (e) => {

      const fileInfos: FileList | null = (<HTMLInputElement>e.target).files;
      if (fileInfos === null) {
        return;
      }
      const fileKeys: string[] = [];
      fileNameInput.hidden = true;
      progressBar.hidden = false;


      for (let i = 0; i < fileInfos.length; i++) {
        if (i > 0) {
          progressBar.value = (i / fileInfos.length) * 100;
        } else {
          progressBar.value = 0;

        }
        progressBar.textContent = `${progressBar.value}%`;

        const fileData: FileSkelValues = await this.fileUpload(fileInfos[i])
        this.mainInstance.relationalCache[fileData["key"]] = {"dest": fileData}

        if (!this.boneStructure["multiple"]) {
          shadowKey.value = fileData["key"];
          fileNameInput.value = fileData["name"];
          const obj = this.reWriteBoneValue();
          this.mainInstance.internboneValue = obj;
          this.mainInstance.handleChange();
        } else {
          fileKeys.push(fileData["key"]);

        }
      }
      if (this.boneStructure["multiple"]) {
        shadowKey.value = fileKeys.shift();
        const boneValues: Record<string, BoneValue> = this.reWriteBoneValue();
        let boneValues_array: BoneValue[]  = getPath(boneValues, path);
        boneValues_array = boneValues_array.concat(fileKeys);
        const obj = {};
        createPath(obj, path, boneValues_array);
        const mulWrapper: HTMLElement | null = this.mainInstance.bone.querySelector('[data-multiplebone="' + path + '"]');

        if (mulWrapper !== null) {
          const element = this.createMultipleWrapper(getPath(obj, path), lang)[0];
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

  fileUpload(file: File): Promise<FileSkelValues> {
    return new Promise((resolve, reject) => {
      FileBone.getUploadUrl(file).then((uploadData: UploadUrlResponse) => {
        FileBone.uploadFile(file, uploadData).then(_ => {
          FileBone.addFile(uploadData).then((fileData: Record<string, FileSkelValues>) => {
            resolve(fileData["values"]);
          }).catch((err) => {
            reject(err)
          });
        }).catch((err) => {
          reject(err)
        });
      }).catch((err) => {
        reject(err)
      });
    });
  }


  static getUploadUrl(file: File) {
    return new Promise((resolve, reject) => {
      getSkey().then(skey => {

        const data: Record<string, string> = {
          "fileName": file.name,
          "mimeType": file.type,
          "size": file.size.toString(),
          "skey": skey,
        }
        fetch(`${apiurl}/json/file/getUploadURL`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(data).toString()
        }).then(response => response.json())
          .then((uploadValues: Record<string, any>) => resolve(uploadValues["values"]))
          .catch((err) => {
            reject(err)
          })
      })
    });
  }

  static uploadFile(file: File, uploadData: UploadUrlResponse) {

    return new Promise((resolve, reject) => {
      fetch(uploadData["uploadUrl"], {
        method: "POST",
        body: file,
        mode: "no-cors",

      }).then(response => {
        resolve(response)
      }).catch((reason) => reject(reason))
    })

  }

  static addFile(uploadData: UploadUrlResponse) {


    return new Promise((resolve, reject) => {
      const currentUpload: Record<string, any> = {};
      currentUpload["key"] = uploadData["uploadKey"];
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
        }).catch((err) => {
          reject(err)
        });
      });
    });
  }


}

