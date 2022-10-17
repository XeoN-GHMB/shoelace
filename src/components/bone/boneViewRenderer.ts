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
import {BooleanBone} from "./bones/booleanBone";
import SlBone from "./bone";
import {PasswordBone} from "./bones/passwordBone";
import {ColorBone} from "./bones/colorBone";
import {EmailBone} from "./bones/emailBone";
import {KeyBone} from "./bones/keyBone";

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

  constructor(boneName: any, boneValue: any, boneStructure: object, mainInstance: SlBone) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }


  getBone(): object {
    let cls: any;

    switch (this.boneStructure["type"].split(".")[0]) {
      case "str":
        if (this.boneStructure["type"] === "str.email") {
          cls = EmailBone;
        } else {
          cls = StringBone;
        }

        break;
      case "numeric":
        cls = NumericBone;
        break;
      case "date":
        cls = DateBone;
        break;
      case "bool":
        cls = BooleanBone;
        break;
      case "record":
        cls = RecordBone;
        break;
      case "relational":
        cls = RelationalBone;
        if (this.boneStructure["type"].startsWith("relational.tree.leaf.file")) {
          cls = FileBone;
        }
        break;
      case "select":
        cls = SelectBone;
        break;
      case "spatial":
        cls = SpatialBone;
        break;
      case "password":
        cls = PasswordBone;
        break;
      case "color":
        cls = ColorBone;
        break;
      case "key":
        cls = KeyBone;
        break;
      default:
        cls = RawBone
    }
    return cls;
  }


}






