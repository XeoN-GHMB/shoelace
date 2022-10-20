import {RawBone} from "./rawBone";

import tinymce from "tinymce";
import {Editor} from "@tinymce/tinymce-webcomponent/dist/tinymce-webcomponent.js";
import * as theme from "tinymce/themes/silver/theme.js";
import * as models from "tinymce/models/dom/";
import * as icons from "tinymce/icons/default/";


import * as table from "tinymce/plugins/table";
import * as code from "tinymce/plugins/code";
import * as image from "tinymce/plugins/image";
import {apiurl, createPath} from "../utils";
import {FileBone} from "./fileBone";

import contentCss from "tinymce/skins/content/default/content.css";

export class TextBone extends RawBone {
  getEditor(value: any, boneName: string, lang: any = null): HTMLElement {

    const ele = document.createElement("div");
    let editor;
    let _ = Editor; // Enfocre Editor to load // todo find a better suliotion
    _ = theme;
    _ = models;
    _ = icons;

    _ = table;
    _ = code;
    _ = image;
    console.log(contentCss);
    console.log(contentCss.toString());
    const self = this;
    setTimeout(function () {
      tinymce.init({
        target: ele,
        base_url: `${apiurl}/_tinymce/`,
        relative_urls: false,
        toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | '
          + 'alignleft aligncenter alignright alignjustify | '
          + 'table  image help',

        plugins: ["table", "code", "image"],
        formats: {bold: {inline: 'span', 'classes': 'viur-txt-bold'}},
        valid_elements: self.getValidTagString(),
        valid_classes: "viur-txt-*",
        images_upload_handler: self.uploadHandler,

        setup: function (editor) {
          editor.on('preinit', () => {
            console.log("=",editor)
            editor.parser.removeAttributeFilter("class") //todo needed?
            editor.serializer.removeAttributeFilter("class") //todo needed?
            editor.parser.addAttributeFilter("class", (nodes) => {self.classValidation(nodes,editor)})
            editor.serializer.addAttributeFilter("class", (nodes) => {self.classValidation(nodes,editor)})
          })
          editor.on('init', () => {

            editor.setContent(value);
          });
          editor.on('Change', (e) => {
            createPath(self.mainInstance.internboneValue, boneName, editor.getContent());
            self.mainInstance.handleChange();

          });
        }


      })
    }, 1) //wait 1 tick for init;


    return ele;
  }

  getValidTagString(): string {
    let s = "";
    //todo class for  all ??
    for (const tag of this.boneStructure["validHtml"]["validTags"]) {
      if (this.boneStructure["validHtml"]["validAttrs"][tag] === undefined) {
        this.boneStructure["validHtml"]["validAttrs"][tag] = ["class"];
      } else {
        this.boneStructure["validHtml"]["validAttrs"][tag].push("class")
      }

      s += tag + "[" + this.boneStructure["validHtml"]["validAttrs"][tag].join("|") + "],";

    }

    return s;

  }

  classValidation(nodes, editor) {
    const validClasses = editor.schema.getValidClasses();
    let i = nodes.length;
    while (i--) {

      const node = nodes[i];
      const classList = node.attr('class').split(" ");
      let classValue = '';
      for (let ci = 0; ci < classList.length; ci++) {
        const className = classList[ci];
        let valid = false;
        let validClassesMap = validClasses['*'];
        if (validClassesMap[className]) // direct match
        {
          valid = true;
        }
        if (!valid) {
          for (const key of Object.keys(validClassesMap)) {
            console.log("Keys", key)
            if (key.endsWith("*"))//we have an wildcard
            {
              if (className.startsWith(key.substring(0, key.indexOf("*")))) {
                valid = true;
              }
            }
          }
        }
        if (valid) {
          classValue += className + " ";
        }

      }
      if (classValue.length > 0) {
        console.log("valid", classValue)
        node.attr('class', classValue);
      }

    }

  }
  uploadHandler(blobInfo,progress) {
    return new Promise((resolve, reject) => {
      FileBone.getUploadUrl(blobInfo.blob()).then(uploadData => {

        FileBone.uploadFile(blobInfo.blob(), uploadData).then(resp => {

          FileBone.addFile(uploadData).then((fileData: object) => {
            resolve(fileData["values"]["downloadUrl"])

          })
        })
      })
    })
  }

}
