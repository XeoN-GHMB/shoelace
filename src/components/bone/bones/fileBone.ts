// @ts-nocheck
import {html} from "lit";
import {formatstring, getSkey, createPath, getPath, translate} from "../utils";
import {RawBone} from "./rawBone";
import type {FileSkelValues, UploadUrlResponse} from "../interfaces";
import type {BoneValue} from "./rawBone";
import type {TemplateResult} from "lit";
import SlBone from "../bone";
import SlButton from "../../button/button";
import SlInput from "../../input/input";

export class FileBone extends RawBone {

  progressBar:HTMLElement
  fileNameInput:HTMLElement
  shadowKey:HTMLElement
  path:String


  view(): string | TemplateResult<1> {
    function appendImage(data, boneStructure, lang: string | null = null) {
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

  getEditor(value: string | Record<string, FileSkelValues>, boneName: string, lang: null | string = null): HTMLElement {


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
    this.shadowKey = document.createElement("sl-input");
    this.fileNameInput = document.createElement("sl-input");
    const uploadButton = document.createElement("sl-button");
    const clearUploadButton = document.createElement("sl-button");
    const clearUploadIcon = document.createElement("sl-icon");
    const uploadIcon = document.createElement("sl-icon");

    this.progressBar = document.createElement("sl-progress-bar");

    uploadIcon.setAttribute("name", "file-earmark-arrow-up");
    uploadButton.appendChild(uploadIcon);
    uploadButton.setAttribute("variant", "success");
    uploadButton.setAttribute("outline", "");
    uploadButton.classList.add("upload-button");
    uploadButton.title = translate("actions.addFile");
    uploadButton.disabled = this.boneStructure["readonly"];
    uploadButton.addEventListener("click", () => {
      shadowFile.click();
    })

    clearUploadButton.setAttribute("variant", "danger");
    clearUploadButton.setAttribute("outline", "");
    clearUploadIcon.setAttribute("name", "trash");
    clearUploadIcon.disabled = this.boneStructure["readonly"];
    clearUploadButton.classList.add("upload-button");
    clearUploadButton.appendChild(clearUploadIcon);
    clearUploadButton.addEventListener("click", () => {
      delete this.mainInstance.relationalCache[this.shadowKey.value]
      shadowFile.value=""
      this.fileNameInput.value=""
      this.shadowKey.value = ""
    })


    shadowFile.type = "file";
    let filter: string;

    if (this.boneStructure["valid_mime_types"] !== null && this.boneStructure["valid_mime_types"] !== undefined) {
      if (this.boneStructure["valid_mime_types"].indexOf("*") === -1) {
        filter = this.boneStructure["valid_mime_types"].join(",")
      } else {
        filter = "*";
      }

    } else {
      filter = "*";
    }

    shadowFile.accept = filter;
    shadowFile.hidden = true;

    this.shadowKey.hidden = true;
    this.shadowKey.name = boneName;
    if (value !== null && value !== undefined) {
      this.shadowKey.value = key.toString();
    }

    shadowFile.multiple = this.boneStructure["multiple"];
    this.path = lang === null ? this.boneName : `${this.boneName}.${lang.toString()}`;

    shadowFile.addEventListener("change", async (e) => {

      const fileInfos: FileList | null = (<HTMLInputElement>e.target).files;
      if (fileInfos === null) {
        return;
      }
      await this.handleFileEvent(fileInfos);
    });
    //fileNameInput
    this.fileNameInput.disabled = true;
    this.fileNameInput.title = translate("actions.addFile");
    this.fileNameInput.placeholder = translate("actions.addFile");
    this.fileNameInput.addEventListener("click", () => {
      if (!this.boneStructure["readonly"]) {
        shadowFile.click();
      }


    })

    if (value !== null && value !== "") { //Fixme why ==""
      try {
        this.fileNameInput.value = this.mainInstance.relationalCache[key]["dest"]["name"];
      } catch (e) {
        console.log("erorr in file value", value);
      }

    }
    this.progressBar.hidden = true;
    this.progressBar.classList.add("progress-bar-values");

    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(this.shadowKey);
    fileContainer.appendChild(this.fileNameInput);
    fileContainer.appendChild(this.progressBar);

    fileContainer.appendChild(uploadButton);
    fileContainer.appendChild(clearUploadButton);
    if(!this.boneStructure["readonly"]){
      fileContainer.addEventListener("dragover",(e)=>{
        e.preventDefault()
        fileContainer.classList.add("fileupload-dropzone")
      })

      fileContainer.addEventListener("drop",async (e)=>{
        fileContainer.classList.remove("fileupload-dropzone")
        e.preventDefault()
        let fileInfos =e.dataTransfer.files
        await this.handleFileEvent(fileInfos);
      })

      fileContainer.addEventListener("dragleave",(e)=>{
        fileContainer.classList.remove("fileupload-dropzone")
      })
    }

    return fileContainer;
  }

  fileUpload(file: File): Promise<FileSkelValues> {
    return new Promise((resolve, reject) => {
      FileBone.getUploadUrl(file, this.mainInstance).then((uploadData: UploadUrlResponse) => {
        FileBone.uploadFile(file, uploadData).then(_ => {
          FileBone.addFile(uploadData, this.mainInstance).then((fileData: Record<string, FileSkelValues>) => {
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

  async handleFileEvent(fileInfos: FileList | null ){
      if (fileInfos === null) {
        return;
      }

      let lang = null

      const fileKeys: string[] = [];
      this.fileNameInput.hidden = true;
      this.progressBar.hidden = false;


      for (let i = 0; i < fileInfos.length; i++) {
        if (i > 0) {
          this.progressBar.value = (i / fileInfos.length) * 100;
        } else {
          this.progressBar.value = 0;

        }
        this.progressBar.textContent = `${this.progressBar.value}%`;

        const fileData: FileSkelValues = await this.fileUpload(fileInfos[i])
        this.mainInstance.relationalCache[fileData["key"]] = {"dest": fileData}

        if (!this.boneStructure["multiple"]) {
          this.shadowKey.value = fileData["key"];
          this.fileNameInput.value = fileData["name"];
          const obj = this.reWriteBoneValue();
          this.mainInstance.internboneValue = obj;
          this.mainInstance.handleChange();
          this.progressBar.hidden = true;
          this.fileNameInput.hidden = false;
        } else {
          fileKeys.push(fileData["key"]);

        }
      }
      if (this.boneStructure["multiple"]) {
        this.shadowKey.value = fileKeys.shift();
        const boneValues: Record<string, BoneValue> = this.reWriteBoneValue();
        let boneValues_array: BoneValue[] = getPath(boneValues, this.path);
        boneValues_array = boneValues_array.concat(fileKeys);
        const obj = {};
        createPath(obj, this.path, boneValues_array);
        const multipleWrapper: HTMLElement | null = this.mainInstance.bone.querySelector(`[data-multiplebone="${this.path}"]`);

        if (multipleWrapper !== null) {
          const element = this.createMultipleWrapper(getPath(obj, this.path), lang)[0];
          multipleWrapper.replaceWith(element);
          this.mainInstance.internboneValue = this.reWriteBoneValue();
          this.mainInstance.handleChange();
        }
      }
  }


  static getUploadUrl(file: File, mainInstance: SlBone) {
    return new Promise((resolve, reject) => {
      getSkey(mainInstance.apiUrl).then(skey => {

        const data: Record<string, string> = {
          "fileName": file.name,
          "mimeType": file.type || "application/octet-stream",
          "size": file.size.toString(),
          "skey": skey,
        }
        fetch(`${mainInstance.apiUrl}/${mainInstance.getRenderer()}/file/getUploadURL`, {
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

  static uploadFile(file: File, uploadData: UploadUrlResponse, mainInstance: SlBone) {

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

  static addFile(uploadData: UploadUrlResponse, mainInstance: SlBone) {


    return new Promise((resolve, reject) => {
      const currentUpload: Record<string, any> = {};
      currentUpload["key"] = uploadData["uploadKey"];
      currentUpload["node"] = undefined;
      currentUpload["skelType"] = "leaf";
      getSkey(mainInstance.apiUrl).then(skey => {
        currentUpload["skey"] = skey;
        fetch(`${mainInstance.apiUrl}/${mainInstance.getRenderer()}/file/add`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
         // mode: "no-cors",
          body: new URLSearchParams(currentUpload).toString(),
        }).then(response => response.json()).then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err)
        });
      });
    });
  }



  postProcessBone(wrapper): any {
    return wrapper
    if (! this.boneStructure["multiple"]) {
      return wrapper
    }

    wrapper.addEventListener("dragover",(e)=>{
      e.preventDefault()
      wrapper.classList.add("fileupload-dropzone")
    })

    wrapper.addEventListener("drop",async (e)=>{
      wrapper.classList.remove("fileupload-dropzone")
      e.preventDefault()
      let fileInfos =e.dataTransfer.files
      let lang = null
      for(let i of fileInfos){
        const name = lang === null ? `${this.boneName}` : `${this.boneName}.${lang}`;
        const multipleWrapper = this.mainInstance.bone.querySelector(`[data-multiplebone='${name}']`);
        const editor = this.addInput(this.boneStructure["emptyvalue"], lang, this.idx[lang])
        multipleWrapper.appendChild(editor);
        multipleWrapper.appendChild(this.addErrorContainer(lang, this.idx[lang]));

        if (lang !== null) {
          this.idx[lang] += 1;
        } else {
          this.idx += 1;
        }

        const clearButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='clearBtn.${name}']`);
        clearButton.style.display = "";
        const placeholder: SlInput = this.mainInstance.bone.querySelector(`[data-name='placeholder.${name}']`);
        placeholder.style.display = "none";

        await this.handleFileEvent([i]);
      }
    })

    wrapper.addEventListener("dragleave",(e)=>{
      wrapper.classList.remove("fileupload-dropzone")
    })
    return wrapper
  }

}

