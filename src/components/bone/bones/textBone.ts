import {RawBone} from "./rawBone";

import tinymce from "tinymce";
import {Editor} from "@tinymce/tinymce-webcomponent/dist/tinymce-webcomponent.js";
import * as theme from "tinymce/themes/silver/theme.js";
import * as models from "tinymce/models/dom/";
import * as icons from "tinymce/icons/default/";

import * as wordcount from "tinymce/plugins/wordcount";
import * as table from "tinymce/plugins/table";
import * as code from "tinymce/plugins/code";
import * as image from "tinymce/plugins/image";
import {apiurl, getSkey} from "../utils";


export class TextBone extends RawBone {
  getEditor(value: any, boneName: string, lang: any = null): HTMLElement {
    const ele = document.createElement("div");
    let _ = Editor; // Enfocre Editor to load // todo find a better suliotion
    _ = theme;
    _ = models;
    _ = icons;

    _ = wordcount;
    _ = table;
    _ = code;
    _ = image;

    const self = this;
    setTimeout(function () {
      tinymce.init({
          target: ele,
          base_url: "http://localhost:8080/_tinymce/",
          toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | '
            + 'alignleft aligncenter alignright alignjustify | '
            + 'table  image help',

          plugins: ["wordcount", "table", "code", "image"],
          formats: {bold: {inline: 'span', 'classes': 'viur-bold'}},
          images_upload_handler: self.uploadHandler

        }
      )
    }, 1) //wait 1 tick for init;


    return ele;
  }

}
