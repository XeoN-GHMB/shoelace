import {html} from "lit";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {RawBone} from "./bones/rawBone";
import {StringBone} from "./bones/stringBone";
import {NumericBone} from "./bones/numericBone";
import {SelectBone} from "./bones/selectBone";
import Da from "../../translations/da";
import {DateBone} from "./bones/dateBone";
import {RecordBone} from "./bones/recordBone";
import {RelationalBone} from "./bones/relationalBone";
import {FileBone} from "./bones/fileBone";
import {TextBone} from "./bones/textBone";
import {SpatialBone} from "./bones/spatialBone";
export class BoneViewRenderer {
  declare boneStructure: {
    descr: string,
    type: string,
    required: boolean,
    params: object,
    visible: boolean,
    readonly: boolean,
    unique: boolean,
    languages: string[],
    emptyValue: any,
    multiple: boolean,
    //Optional Fields

    //relational
    module: string,
    format: string,
    using: [],
    relskel: object,

    //select
    values: [],

    //date
    date: boolean,
    time: boolean,

    //numeric
    precision: number,
    min: number,
    max: number,

    //text
    validHtml: string[],

    //file
    validMimeTypes: string[],

    //spatial

  }
  boneValue: any;
  boneName: string;
  mainInstance: any;

  constructor(boneStructure: object, boneValue: any, boneName: any, mainInstance: any) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }


  boneFormatter(): any {
    if (!this.boneStructure) {
      return;
    }

    switch (this.boneStructure["type"].split(".")[0]) {
      case "str":
        return new StringBone(this.boneValue, this.boneName, this.boneStructure).view();
      //return this.stringBoneRenderer();
      case "numeric":
        return new NumericBone(this.boneValue, this.boneName, this.boneStructure).view();
      //return this.numericBoneRenderer();
      case "date":
        return new DateBone(this.boneValue, this.boneName, this.boneStructure).view();
      case "record":
        return new RecordBone(this.boneValue, this.boneName, this.boneStructure).view();
      case "relational":

        if (this.boneStructure["type"].startsWith("relational.tree.leaf.file")) {
          return new FileBone(this.boneValue, this.boneName, this.boneStructure).view();
        }
        return new RelationalBone(this.boneValue, this.boneName, this.boneStructure).view();
      case "select":
        return new SelectBone(this.boneValue, this.boneName, this.boneStructure).view();
      //return this.selectBoneRenderer();
      case "text":
        return new TextBone(this.boneValue, this.boneName, this.boneStructure).view();
      case "spatial":
        return new SpatialBone(this.boneValue, this.boneName, this.boneStructure).view();

    }
    return new RawBone(this.boneValue, this.boneName, this.boneStructure).view();
  }

  ////////////HELPER FUNCTIONS////////////////



}

////////////HELPER FUNCTIONS////////////////

export function getPath(obj: object, path: string | string[]): object | undefined {

  path = typeof path === 'string' ? path.split('.') : path;

  let current: object = JSON.parse(JSON.stringify(obj));//Depth Copy to lose Reference;
  while (path.length > 0) {
    let [head, ...tail] = path;
    path = tail;
    if (!Number.isNaN(parseInt(head))) {
      head = parseInt(head)
    }
    if (current[head] === undefined) {
      return undefined;
    }
    current = current[head];


  }

  return current;
}

export function escapeString(value: string | string[]): string | string[] {
  if (value === null) {
    return "";
  }
  if (Array.isArray(value)) {
    value.map(v => escapeString(v));


  } else {
    value = value.replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&#39;", "'")
      .replaceAll("&#040;", "(")
      .replaceAll("&#041;", ")")
      .replaceAll("&#061;", "=")
  }
  return value

}



