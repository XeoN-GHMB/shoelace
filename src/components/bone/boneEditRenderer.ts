// @ts-nocheck
import {BooleanBone} from "./bones/booleanBone";
import {PasswordBone} from "./bones/passwordBone";
import {ColorBone} from "./bones/colorBone";
import {DateBone} from "./bones/dateBone";
import {EmailBone} from "./bones/emailBone";
import {FileBone} from "./bones/fileBone";
import {KeyBone} from "./bones/keyBone";
import {NumericBone} from "./bones/numericBone";
import {RawBone} from "./bones/rawBone";
import {RecordBone} from "./bones/recordBone";
import {RelationalBone} from "./bones/relationalBone";
import {SelectBone} from "./bones/selectBone";
import {SpatialBone} from "./bones/spatialBone";
import {StringBone} from "./bones/stringBone";
import {TextBone} from "./bones/textBone";
import type SlBone from "./bone";
import type {BoneStructure} from "./interfaces";
import {JsonBone} from "./bones/jsonBone";


export class BoneEditRenderer {


  declare boneValue: any | any[];
  boneName: string;
  mainInstance: SlBone;
  depth = 0;
  boneStructure: BoneStructure;


  constructor(boneName: any, boneValue: any, boneStructure: BoneStructure, mainInstance: SlBone) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
  }

  getEditor() {
    const cls: object = this.getBone()
    return new cls(this.boneName, this.boneValue, this.boneStructure, this.mainInstance).edit()

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
      case "text":
        cls = TextBone;
        break;
      case "raw":
        if (this.boneStructure["type"].startsWith("raw.json")) {
          cls = JsonBone;
        } else {
          cls = RawBone
        }
        break
      default:
        cls = RawBone
    }
    return cls;
  }

}
