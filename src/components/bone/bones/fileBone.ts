import {RawBone} from "./rawBone";
import {html, TemplateResult} from "lit";
import {formatstring, getSkey, apiurl} from "../utils";

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

  getEditor(value: any, boneName: string): HTMLElement {


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
      this.getUploadUrl(file).then(uploadData => {

        fileNameInput.value = "Uploading...";
        this.uploadFile(file, uploadData).then(resp => {


          this.addFile(uploadData).then((fileData: object) => {
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


  getUploadUrl(file: File) {
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

  uploadFile(file: File, uploadData: any) {

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


}

