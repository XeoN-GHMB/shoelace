import {RawBone} from "./rawBone";

export class SelectBone extends RawBone {
  constructor(boneValue: any, boneName = "", boneStructure = {}) {
    super(boneValue, boneName, boneStructure);
  }

  view() {
    if (this.boneStructure["languages"] !== null) {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {
          if (!Array.isArray(this.boneValue[lang])) {
            this.boneValue[lang] = [this.boneValue[lang]];
          }
          for (const i in this.boneValue[lang]) {
            this.boneStructure["values"].forEach((value: any) => {
              if (this.boneValue[lang][i] === value[0]) {
                this.boneValue[lang][i] = value[1];
              }
            })
          }
        }

      } else {
        for (const lang of this.boneStructure["languages"]) {
          this.boneStructure["values"].forEach((value: any) => {
            if (this.boneValue[lang] === value[0]) {
              this.boneValue[lang] = value[1];
            }
          })
        }
      }
    } else {
      if (this.boneStructure["multiple"]) {
        if (!Array.isArray(this.boneValue)) {
          this.boneValue = [this.boneValue];
        }
        for (const i in this.boneValue) {
          this.boneStructure["values"].forEach((value: any) => {

            if (this.boneValue[i] === value[0]) {
              this.boneValue[i] = value[1];
            }
          })
        }


      } else {

        this.boneStructure["values"].forEach((value: any) => {

          if (this.boneValue === value[0]) {

            this.boneValue = value[1];

          }
        })
      }
    }
    return super.view()
  }


}
