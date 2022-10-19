import SlBone from "./bone";
import {StringBone} from "./bones/stringBone";
import {NumericBone} from "./bones/numericBone";
import {DateBone} from "./bones/dateBone";
import {BooleanBone} from "./bones/booleanBone";
import {SelectBone} from "./bones/selectBone";
import {RelationalBone} from "./bones/relationalBone";
import {RecordBone} from "./bones/recordBone";
import {BoneStructure, RawBone} from "./bones/rawBone";
import {FileBone} from "./bones/fileBone";
import {SpatialBone} from "./bones/spatialBone";
import {PasswordBone} from "./bones/passwordBone";
import {ColorBone} from "./bones/colorBone";
import {EmailBone} from "./bones/emailBone";
import {KeyBone} from "./bones/keyBone";
import {TextBone} from "./bones/textBone";


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
      default:
        cls = RawBone
    }
    return cls;
  }

}
