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
import {BoneEditRenderer} from "../boneEditRenderer";

export class FileBone extends RawBone {

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

      } else if ("key" in value){
        key = value["key"];
      }
    } else {
      key = value;
    }

    const fileContainer = document.createElement("div");
    fileContainer.classList.add("file-container")
    fileContainer.dataset.boneName = boneName;

    const hasUsing = this.boneStructure["using"]!==null;

    const shadowFile = document.createElement("input");
    const shadowKey = document.createElement("sl-input");
    const fileNameInput = document.createElement("sl-input");
    const uploadButton = document.createElement("sl-button");
    const uploadIcon = document.createElement("sl-icon");
    const progressBar = document.createElement("sl-progress-bar");
    const clearUploadButton = document.createElement("sl-button");
    const clearUploadIcon = document.createElement("sl-icon");

    fileNameInput.dataset.name = "entrylabel"
    shadowKey.dataset.name = "entrykey"
    progressBar.dataset.name = "progress"

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

    if(!this.boneStructure["multiple"]) {

      clearUploadButton.setAttribute("variant", "danger");
      clearUploadButton.setAttribute("outline", "");
      clearUploadIcon.setAttribute("name", "x");
      clearUploadButton.disabled = this.boneStructure["readonly"];
      clearUploadButton.classList.add("upload-button");
      clearUploadButton.appendChild(clearUploadIcon);
      clearUploadButton.addEventListener("click", () => {
        this.saveState(lang);
        shadowFile.value = ""
        fileNameInput.value = ""
        shadowKey.value = ""
        this.mainInstance.internboneValue = this.reWriteBoneValue();
        this.mainInstance.handleChange();
      })
    }


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

    shadowKey.hidden = true;
    if(hasUsing)
    {
      shadowKey.name = `${boneName}.key`;
    }
    else
    {
      shadowKey.name = boneName;
    }

    if (value !== null && value !== undefined) {
      shadowKey.value = key.toString();
    }

    shadowFile.multiple = this.boneStructure["multiple"];
    const path = lang === null ? this.boneName : `${this.boneName}.${lang.toString()}`;

    shadowFile.addEventListener("change", async (e) => {

      const fileInfos: FileList | null = (<HTMLInputElement>e.target).files;
      if (fileInfos === null) {
        return;
      }
      await this.handleFileEvent(fileInfos, path, lang, fileNameInput, shadowKey, progressBar);
    });
    //fileNameInput
    fileNameInput.disabled = true;
    fileNameInput.title = translate("actions.addFile");
    fileNameInput.placeholder = translate("actions.addFile");
    fileNameInput.addEventListener("click", () => {
      if (!this.boneStructure["readonly"]) {
        shadowFile.click();
      }


    })

    if (value !== null && value !== "") { //Fixme why ==""
      try {
        fileNameInput.value = this.mainInstance.relationalCache[key]["dest"]["name"];
      } catch (e) {
        console.log("error in file value", value);
      }

    }
    progressBar.hidden = true;
    progressBar.classList.add("progress-bar-values");

    fileContainer.appendChild(shadowFile);
    fileContainer.appendChild(shadowKey);
    fileContainer.appendChild(fileNameInput);
    fileContainer.appendChild(progressBar);


    fileContainer.appendChild(uploadButton);
    if(!this.boneStructure["multiple"]) {
      fileContainer.appendChild(clearUploadButton);
    }
    if(!this.boneStructure["readonly"] && !this.boneStructure["multiple"]){
      fileContainer.addEventListener("dragover",(e)=>{
        e.preventDefault()
        fileContainer.classList.add("fileupload-dropzone")
      })

      fileContainer.addEventListener("drop",async (e)=>{
        fileContainer.classList.remove("fileupload-dropzone")
        e.preventDefault()
        let fileInfos =e.dataTransfer.files
        await this.handleFileEvent(fileInfos, path, lang, fileNameInput, shadowKey, progressBar);
      })

      fileContainer.addEventListener("dragleave",(e)=>{
        fileContainer.classList.remove("fileupload-dropzone")
      })
    }

    if(hasUsing)
    {
      const outerWrapper = document.createElement("div");
      outerWrapper.classList.add("bone-inner-wrap");

      const usingWrapper = document.createElement("div");
      usingWrapper.classList.add("record-wrapper");

      usingWrapper.dataset.boneName = boneName;
      usingWrapper.dataset.multiple = this.boneStructure["multiple"].toString();
      usingWrapper.dataset.depth = this.depth.toString();
      let relValue = null;
      if(this.mainInstance.relationalCache[value]!==undefined && this.mainInstance.relationalCache[value]!==null)
      {
         relValue = this.mainInstance.relationalCache[value]["rel"];
      }


      for (const [_boneName, _boneStructure] of Object.entries(this.boneStructure["using"])) {

        let recordBoneValue: any = null;
        if (relValue !== null && relValue !== undefined) {

          recordBoneValue = relValue[_boneName];

        }
        const newBoneName = `${boneName}.${_boneName}`;
        _boneStructure["readonly"] = this.boneStructure["readonly"]//override readonly that all child bones are readonly too
        const bone: object = new BoneEditRenderer(newBoneName, recordBoneValue, _boneStructure, this.mainInstance).getBone();
        const tmp: HTMLElement = new bone(newBoneName, recordBoneValue, _boneStructure, this.mainInstance).edit(true, this.depth + 1);
        tmp.dataset.fromRecord = "true";

        usingWrapper.appendChild(tmp);
      }
      outerWrapper.appendChild(fileContainer);
      outerWrapper.appendChild(usingWrapper);
      return outerWrapper;
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

  async handleFileEvent(fileInfos: FileList | null, path, lang, fileNameInput, shadowKey, progressBar ){
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
          progressBar.hidden = true;
          fileNameInput.hidden = false;
        } else {
          fileKeys.push(fileData["key"]);

        }
      }
      if (this.boneStructure["multiple"]) {
        shadowKey.value = fileKeys.shift();
        const boneValues: Record<string, BoneValue> = this.reWriteBoneValue();
        let boneValues_array: BoneValue[] = getPath(boneValues, path);
        boneValues_array = boneValues_array.concat(fileKeys);
        const obj = {};
        createPath(obj, path, boneValues_array);
        const multipleWrapper: HTMLElement | null = this.mainInstance.bone.querySelector(`[data-multiplebone="${path}"]`);

        if (multipleWrapper !== null) {
          const element = this.createMultipleWrapper(getPath(obj, path), lang)[0];
          multipleWrapper.replaceWith(element);
          this.mainInstance.internboneValue = this.reWriteBoneValue();
          this.mainInstance.handleChange();
        }
      }
      this.mainInstance.handleChange();
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
    if (! this.boneStructure["multiple"]) {
      return wrapper
    }
    if(this.boneStructure["readonly"]){
      return wrapper
    }

    wrapper.addEventListener("dragover",(e)=>{
      e.preventDefault()
      wrapper.classList.add("fileupload-dropzone")
    })

    wrapper.addEventListener("drop",async (e)=>{
      wrapper.classList.remove("fileupload-dropzone")
      e.preventDefault()
      let fileInfos = e.dataTransfer.files
      let lang = null


      for(let i of fileInfos){
         if (this.boneStructure["languages"] !== null) {
           lang = this.mainInstance.bone.querySelector(`sl-tab[active]`).panel
         }

         const path = lang === null ? this.boneName : `${this.boneName}.${lang.toString()}`;
         const multipleWrapper = this.mainInstance.bone.querySelector(`[data-multiplebone='${path}']`);

         let fileNameInput = null
         let shadowKey = null
         let progressBar = null

        if (lang !== null) {
          multipleWrapper.appendChild(this.addInput(this.boneStructure["emptyvalue"], lang, this.idx[lang]));
          multipleWrapper.appendChild(this.addErrorContainer(lang, this.idx[lang]));
          fileNameInput = multipleWrapper.querySelectorAll("sl-input[data-name='entrylabel']")[this.idx[lang]]
          shadowKey = multipleWrapper.querySelectorAll("sl-input[data-name='entrykey']")[this.idx[lang]]
          progressBar = multipleWrapper.querySelectorAll("sl-progress-bar[data-name='progress']")[this.idx[lang]]
          this.idx[lang] += 1;
        } else {
          multipleWrapper.appendChild(this.addInput(this.boneStructure["emptyvalue"], null, this.idx));
          multipleWrapper.appendChild(this.addErrorContainer(null, this.idx));
          fileNameInput = multipleWrapper.querySelectorAll("sl-input[data-name='entrylabel']")[this.idx]
          shadowKey = multipleWrapper.querySelectorAll("sl-input[data-name='entrykey']")[this.idx]
          progressBar = multipleWrapper.querySelectorAll("sl-progress-bar[data-name='progress']")[this.idx]
          this.idx += 1;
        }

        const clearButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='clearBtn.${path}']`);
        clearButton.style.display = "";
        const placeholder: SlInput = this.mainInstance.bone.querySelector(`[data-name='placeholder.${path}']`);
        placeholder.style.display = "none";


        await this.handleFileEvent([i], path, lang, fileNameInput, shadowKey, progressBar);
      }
    })

    wrapper.addEventListener("dragleave",(e)=>{
      wrapper.classList.remove("fileupload-dropzone")
    })
    return wrapper
  }

}

