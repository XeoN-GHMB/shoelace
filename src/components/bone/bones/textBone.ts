// @ts-nocheck
/**
 * Todo/problem/fixme ??
 * the problem is tiny mce load the css from a server
 */
import {RawBone} from "./rawBone";
import tinymce, {AstNode, Editor} from "tinymce";
import {apiurl, createPath} from "../utils";
import {FileBone} from "./fileBone";


import {FileSkelValues} from "../interfaces";

export class TextBone extends RawBone {
  getEditor(value: any, boneName: string, lang: string | null = null): HTMLElement {
    const ele = document.createElement("div");
    /*
  Note: We have included the plugin in the same JavaScript file as the TinyMCE
  instance for display purposes only. Tiny recommends not maintaining the plugin
  with the TinyMCE instance and using the `external_plugins` option.
*/
    tinymce.PluginManager.add('advcode', (editor, url) => {
      const openDialog = () => editor.windowManager.open({
        title: 'Example plugin',
          size: "large",
        body: {
          type: 'panel',
          items: [
            {
              type: 'customeditor',
              tag: "div",
              name: 'codeview',
              scriptUrl: "http://localhost:8080/_tinymce/advcode.js",
              scriptId: "tinymce.plugins.advcode.customeditor",
              settings: {
                "lineWrapping": true,
                "lineNumbers": true,
                "foldGutter": true,
                "theme": "default",
                "direction": "ltr",
                "gutter": true,
                "editorId": "mce_0",
                "customEditorScriptUrl": "http://localhost:8080/_tinymce/advcode.js",
                "codeMirrorScriptUrl": "http://localhost:8080/_tinymce/codemirror.min.js",
                "codeMirrorCssUrl": "http://localhost:8080/_tinymce/codemirror.min.css",
              }
            }
          ]
        },
        buttons: [
          {
            type: 'cancel',
            text: 'Close'
          },
          {
            type: 'submit',
            text: 'Save',
            buttonType: 'primary'
          }
        ],
        initialData: {
          "codeview": "<p>The Advanced Code Editor (<code>advcode</code>) plugin provides the same dialog as the code (<code>code</code>) plugin, but with the following additional features:</p>\n<ul>\n<li>Syntax highlighting</li>\n<li>Element matching and closing</li>\n<li>Code folding</li>\n<li>Multiple selections/carets</li>\n<li>Search and replace</li>\n</ul>\n<p>To open the Advanced Code Editor dialog:</p>\n<ul>\n<li>On the menu bar, open <strong>View</strong> &gt; <strong>Source code</strong>.</li>\n<li>On the menu bar, open <strong>Tools</strong> &gt; <strong>Source code</strong>.</li>\n<li>Click the <strong>Source code</strong> toolbar button.</li>\n</ul>"
        }, onSubmit: (api) => {
          const data = api.getData();
          /* Insert content when the window form is submitted */
          editor.insertContent('Title: ' + data.title);

          api.close();
        }
      });
      /* Add a button that opens a window */
      editor.ui.registry.addButton('code', {
        text: 'My button',
        onAction: () => {
          /* Open window */
          const dialog = openDialog();
          console.log(dialog)
        }
      });
      /* Adds a menu item, which can then be included in any menu via the menu/menubar configuration */
      editor.ui.registry.addMenuItem('code', {
        text: 'Example plugin',
        onAction: () => {
          /* Open window */
          openDialog();
        }
      });
      /* Return the metadata for the help plugin */
      return {
        getMetadata: () => ({
          name: 'Example plugin',
          url: 'http://exampleplugindocsurl.com'
        })
      };
    });


    const self = this;

    setTimeout(function () {
      tinymce.init({
        target: ele,
        base_url: `https://cdn.jsdelivr.net/npm/tinymce@6.2.0/`,
        suffix: ".min",
        width: "100%",
        menubar: false,
        relative_urls: false,

        toolbar: 'undo redo | blocks | bold italic backcolor | '
          + 'alignleft aligncenter alignright alignjustify | '
          + 'table code advcode',

        plugins: ["table", "code", "preview", "advcode"],
        formats: {bold: {inline: 'span', 'classes': 'viur-txt-bold'}},
        valid_elements: self.getValidTagString(),
        valid_classes: {"*": self.boneStructure["validHtml"]["validClasses"].join(" ")},

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
          });
          editor.on('Change', (e) => {
            createPath(self.mainInstance.internboneValue, boneName, editor.getContent());
            console.log("get content", editor.getContent())
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

      s += tag + "[" + this.boneStructure["validHtml"]["validAttrs"][tag].join("|") + "],";

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
        let validClassesMap = validClasses['*'];
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
          classValue += className + " ";
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
      FileBone.getUploadUrl(blobInfo.blob()).then(uploadData => {

        FileBone.uploadFile(blobInfo.blob(), uploadData).then(resp => {

          FileBone.addFile(uploadData).then((fileData: FileSkelValues) => {
            console.log(fileData)
            resolve(fileData["values"]["downloadUrl"])

          })
        })
      })
    })
  }

}
