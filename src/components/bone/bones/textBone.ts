// @ts-nocheck
import type {AstNode, Editor} from "tinymce";
/**
 * Todo/problem/fixme ??
 * the problem is tiny mce load the css from a server
 */
import tinymce from "tinymce";
import icons from "tinymce/icons/default/";
import model from "tinymce/models/dom/";
import code_plugin from "tinymce/plugins/code/";
import table_plugin from "tinymce/plugins/table/";
import theme from "tinymce/themes/silver/";
import {createPath} from "../utils";
import {FileBone} from "./fileBone";
import {RawBone} from "./rawBone";
import type {FileSkelValues} from "../interfaces";

import textBoneStyle from "../styles/textBone.styles";

export class TextBone extends RawBone {
  getEditor(value: any, boneName: string, lang: string | null = null): HTMLElement {
    //We render a textarea if we have no valid html
    if (this.boneStructure["validHtml"] === null) {
      const ele = document.createElement("textarea");
      ele.dataset["name"] = boneName;
      ele.dataset["textbone"] = "true";
      ele.rows=15;
      if(value!==null || value!==undefined)
      {
        ele.value=value;
      }
      ele.addEventListener('change', (e) => {
        createPath(this.mainInstance.internboneValue, boneName, ele.value);
        this.mainInstance.handleChange();
      });

      return ele;
    }


    const ele = document.createElement("div");
    ele.dataset["name"] = boneName;
    ele.dataset["textbone"] = "true";
    //IMport scripts
    let _ = theme;
    _ = model;
    _ = icons;

    _ = code_plugin;
    _ = table_plugin;


    const self = this;
    let valid_classes = {};
    let toolbar = "undo redo";
    if (this.boneStructure["validHtml"] !== null) {
      valid_classes = {"*": self.boneStructure["validHtml"]["validClasses"].join(" ")};
      toolbar = 'undo redo | blocks | bold italic underline backcolor | '
        + 'alignleft aligncenter alignright alignjustify | '
        + 'table code'
    }


    setTimeout(() => {
      tinymce.init({
        target: ele,
        width: "100%",
        menubar: false,
        relative_urls: false,
        skin: false,
        content_css: false,
        content_style: textBoneStyle.cssText,
        toolbar: toolbar,
        plugins: ["table", "code"],
        formats: self.getFormats(), // TODO add classes
        valid_elements: self.getValidTagString(),
        valid_classes: valid_classes,
        readonly: self.boneStructure["readonly"],
        //images_upload_handler: self.uploadHandler,

        setup: function (editor) {
          editor.on('preinit', () => {
            console.log("=", editor)
            editor.parser.removeAttributeFilter("class") //todo needed?
            editor.serializer.removeAttributeFilter("class") //todo needed?
            editor.parser.addAttributeFilter("class", (nodes) => {
              self.classValidation(nodes, editor)
            })
            editor.serializer.addAttributeFilter("class", (nodes) => {
              self.classValidation(nodes, editor)
            })
          })
          editor.on('init', () => {
            editor.setContent(value);
            self.mainInstance.textboneCache[boneName] = editor;
          });
          editor.on('change', (e) => {

            createPath(self.mainInstance.internboneValue, boneName, editor.getContent());
            console.log("get content", content)
            self.mainInstance.handleChange();

          });
        }


      }).catch((err) => {
        console.log("err", err)
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

      s += `${tag}[${this.boneStructure["validHtml"]["validAttrs"][tag].join("|")}],`;

    }

    return s;

  }

  classValidation(nodes: AstNode[], editor: Editor) {
    const validClasses = editor.schema.getValidClasses();
    let i = nodes.length;
    while (i--) {

      const node: AstNode = nodes[i];
      const classList = node.attr('class').split(" ");
      node.attr('class', null)
      let classValue = '';
      for (let ci = 0; ci < classList.length; ci++) {
        const className = classList[ci];
        let valid = false;
        const validClassesMap = validClasses['*'];
        if (validClassesMap[className]) // direct match
        {
          valid = true;
        }
        if (!valid) {
          for (const key of Object.keys(validClassesMap)) {
            if (key.endsWith("*"))//we have an wildcard
            {
              if (className.startsWith(key.substring(0, key.indexOf("*")))) {
                valid = true;
              }
            }
          }
        }
        if (valid) {
          classValue += `${className} `;
        }

      }
      if (classValue.length > 0) {
        node.attr('class', classValue);
      }

    }

  }

//todo BlobInfo ist not been exported by tinymce :( Write own interface
  uploadHandler(blobInfo, progress) {
    //Todo error handling
    return new Promise((resolve, reject) => {
      FileBone.getUploadUrl(blobInfo.blob(), this.mainInstance).then(uploadData => {

        FileBone.uploadFile(blobInfo.blob(), uploadData).then(resp => {

          FileBone.addFile(uploadData, this.mainInstance).then((fileData: FileSkelValues) => {
            console.log(fileData)
            resolve(fileData["values"]["downloadUrl"])

          })
        })
      })
    })
  }

  getFormats() {
    const obj = {};
    const formats = ["bold", "italic", "underline"];
    for (const f of formats) {
      obj[f] = {inline: 'span', 'classes': `viur-txt-${f}`}
    }
    const aligns = ["alignleft", "aligncenter", "alignright"];
    for (const align of aligns) {
      obj[align] = {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: `viur-txt-${align}`}
    }
    console.log("obj", obj)
    return obj;
  }

}
