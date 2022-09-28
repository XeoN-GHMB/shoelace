import {escapeString, formatstring, getPath} from "./boneViewRenderer";
import SlBone from "./bone";
import SlCombobox from "../combobox/combobox";
import SlIcon from "../icon/icon";
import SlButton from "../button/button";
import SlIconButton from "../icon-button/icon-button";
import SlSelect from "../select/select";
import {emit} from "../../internal/event";
import SlDetails from "../details/details";
//const apiurl=window.location.origin;
const apiurl = "http://localhost:8080";

export class BoneEditRenderer {

  blurCounter = 0;
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
    validHtml: string[]

    //file
    validMimeTypes: string[]

  }

  declare boneValue: any | any[];
  boneName: string;
  mainInstance: SlBone;
  depth = 0;
  //Move vars
  move = false;
  moveElement;
  startHeight = 0;
  startTop = 0;
  fakeElement;
  inputsAbsolutePostions = [];
  absolutePostionSet = false;
  swapElements = [null, null];
  moveElementSrc: HTMLElement;


  constructor(boneStructure: object, boneValue: any, boneName: any, mainInstance: SlBone) {
    this.boneStructure = boneStructure;
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.mainInstance = mainInstance;
    /*
    if (this.boneStructure["type"].startsWith("relational")) {
      console.log(this.boneValue)
      if (this.boneValue !== null && typeof (this.boneValue) !== "string") {
        if (this.boneStructure["languages"] !== null) {
          if (this.boneStructure["multiple"]) {

            for (const lang of this.boneStructure["languages"]) {
              for (const [i, tmpValue] of this.boneValue[lang].entries()) {
                const key = this.boneValue[lang][i]["dest"]["key"];
                this.mainInstance.relationalCache[key] = tmpValue;
                this.boneValue[lang][i] = key;
              }
            }
          } else {
            for (const lang of this.boneStructure["languages"]) {
              const key = this.boneValue[lang]["dest"]["key"];
              this.mainInstance.relationalCache[key] = this.boneValue[lang];
              this.boneValue[lang] = key;
            }
          }
        } else {
          if (this.boneStructure["multiple"]) {
            for (const [i, tmpValue] of this.boneValue.entries()) {
              const key = tmpValue["dest"]["key"];
              this.mainInstance.relationalCache[key] = tmpValue;
              this.boneValue[i] = key;

            }
          } else {
            const key = this.boneValue["dest"]["key"];
            this.mainInstance.relationalCache[key] = this.boneValue;
            this.boneValue = key;
          }
        }
      }

    }
    console.log("cache", this.mainInstance.relationalCache);
    console.log("bone", this.boneValue);
    */
  }


  boneEditor(fromRecord: boolean = false, depth: number): HTMLElement {
    if (depth !== undefined) {
      this.depth = depth;
    }

    let wrapper: HTMLElement;
    if (fromRecord) {
      wrapper = document.createElement("div");

    } else {
      wrapper = document.createElement("form");

      wrapper.addEventListener("submit", (e: Event) => {

        e.preventDefault()
        return false;
      })


    }


    wrapper.classList.add("bone-wrapper")
    wrapper.dataset.boneWrapper = "true";
    wrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    wrapper.dataset.boneName = this.boneName;
    if (this.mainInstance.renderLabel) {
      const boneNameLabel = document.createElement("div");
      boneNameLabel.innerText = this.boneStructure["descr"].length > 0 ? this.boneStructure["descr"] : this.boneName;
      wrapper.appendChild(boneNameLabel);
    }


    if (this.boneStructure["languages"] !== null) {


      const tabGroup = document.createElement("sl-tab-group");
      for (const lang of this.boneStructure["languages"]) {
        //Create Tabs for Langs
        const tab = document.createElement("sl-tab");
        tab.slot = "nav";
        tab.panel = lang;
        tab.innerText = lang;
        tabGroup.appendChild(tab);
      }

      for (const lang of this.boneStructure["languages"]) {

        const tab_panel = document.createElement("sl-tab-panel")
        tab_panel.name = lang;

        const languageWrapper = document.createElement("div");
        languageWrapper.classList.add("language-wrapper");

        if (this.boneStructure.multiple && this.boneStructure["type"] !== "select") {
          // Lang and Mul
          const multipleWrapper = document.createElement("div");
          multipleWrapper.classList.add("multiple-wrapper");
          let idx: number = 0;
          if (this.boneValue !== null) {

            for (const [i, tmpValue] of this.boneValue[lang].entries()) {

              console.log("add land", lang)
              multipleWrapper.appendChild(this.addInput(tmpValue, lang, i));
              multipleWrapper.appendChild(this.addErrorContainer(lang, i));


              idx += 1;
            }
          }
          const addButton = document.createElement("sl-button");

          addButton.addEventListener("click", () => {

            const obj = this.reWriteBoneValue();
            createPath(obj, this.generateboneName(lang, idx), this.boneStructure["emptyValue"]);
            this.mainInstance.boneValue = obj[this.mainInstance.boneName];

          });
          languageWrapper.appendChild(multipleWrapper);
          addButton.innerText = "Add";
          addButton.variant = "success";

          const clearButton = document.createElement("sl-button");
          clearButton.addEventListener("click", () => {
            multipleWrapper.innerHTML = "";//Clear Wrapper;
          });
          clearButton.innerText = "Clear";
          clearButton.id = "clearButton"
          clearButton.variant = "danger";
          clearButton.innerText = "Clear";
          const xicon: SlIcon = document.createElement("sl-icon");
          xicon.name = "x";
          xicon.slot = "suffix";
          clearButton.appendChild(xicon);
          clearButton.variant = "danger";


          tab_panel.appendChild(addButton);
          tab_panel.appendChild(clearButton);
          tab_panel.appendChild(languageWrapper);
          this.addScroll();
          this.addMouseMove();
          this.addMouseUp();
        } else {
          //Lang , no multipler
          const languageWrapper = document.createElement("div");
          languageWrapper.classList.add("language-wrapper");
          languageWrapper.appendChild(this.addInput(this.boneValue[lang], lang));
          languageWrapper.appendChild(this.addErrorContainer(lang));


          tab_panel.appendChild(languageWrapper);
        }
        tabGroup.appendChild(tab_panel);


      }
      wrapper.appendChild(tabGroup);

    } else {

      if (this.boneStructure["multiple"] && this.boneStructure["type"] !== "select") {
        //No Lang , Multiple
        wrapper.dataset.boneName = this.boneName;
        if (this.boneValue === null) {
          this.boneValue = []
        }
        const multipleWrapper = document.createElement("div");
        multipleWrapper.classList.add("multiple-wrapper");
        const addButton = document.createElement("sl-button");
        addButton.innerText = "Add";
        addButton.variant = "success"
        let idx: number = 0;
        for (const [i, tmpValue] of this.boneValue.entries()) {
          console.log("tmp", tmpValue)
          multipleWrapper.appendChild(this.addInput(tmpValue, null, i));
          multipleWrapper.appendChild(this.addErrorContainer(null, i));

          idx += 1;

        }


        addButton.addEventListener("click", () => {
          const obj = this.reWriteBoneValue();
          console.log("add", obj);
          console.log("add name", this.generateboneName(null, idx));
          createPath(obj, this.generateboneName(null, idx), this.boneStructure["emptyValue"]);
          this.mainInstance.boneValue = obj[this.mainInstance.boneName];


        });

        wrapper.appendChild(addButton);
        const clearButton = document.createElement("sl-button");
        clearButton.addEventListener("click", () => {
          multipleWrapper.innerHTML = "";//Clear Wrapper;
        });
        clearButton.innerText = "Clear";
        clearButton.variant = "danger";
        wrapper.appendChild(clearButton);

        wrapper.appendChild(multipleWrapper);
        this.addScroll();
        this.addMouseMove();
        this.addMouseUp();

      } else {
        //No Lang, No Multiple

        const inputElement = this.getEditor(this.boneValue, this.boneName)
        inputElement.dataset.lang = "null";
        inputElement.dataset.multiple = this.boneStructure["multiple"];

        wrapper.appendChild(inputElement);
        wrapper.appendChild(this.addErrorContainer());


      }
    }
    wrapper.addEventListener("sl-focus", (focus_event) => {

      this.blurCounter += 1;


    });
    wrapper.addEventListener("sl-blur", (blur_event) => {

      this.blurCounter -= 1;
      return
      const self: BoneEditRenderer = this;
      setTimeout(function () {

        if (self.blurCounter === 0) {
          const formData = self.reWriteBoneValue();
          self.mainInstance.handleChange(formData);


        }
      }, 20)
    });
    if (!fromRecord) {
      if (this.mainInstance.rendersaveButton) {
        const saveButton = document.createElement("sl-button");
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", () => {
          this.mainInstance.handleChange("fromSave");
        })
        wrapper.appendChild(saveButton);
      }


    }

    return wrapper;


  }

  generateboneName(lang = null, index = null) {
    let newboneName = this.boneName;
    if (lang !== null) {

      newboneName += "." + lang.toString();
    }
    if (index !== null) {
      newboneName += "." + index.toString();
    }
    return newboneName;
  }

  addInput(value: any, lang: string, index = null) {
    const inputWrapper = document.createElement("div");
    const newboneName = this.generateboneName(lang, index);
    //TODO outsoucre style
    inputWrapper.style.display = "flex";
    inputWrapper.style.flexDirection = "row";
    inputWrapper.dataset.boneName = newboneName;


    let clearButton;
    let draggable
    const inputElement: HTMLElement = this.getEditor(value, newboneName);
    inputElement.dataset.lang = lang;
    inputElement.dataset.multiple = this.boneStructure["multiple"];
    inputElement.style.flexGrow = "1";//TODO outsource style

    if (this.boneStructure["multiple"]) {

      clearButton = document.createElement("sl-button");
      clearButton.id = "clearButton"
      clearButton.variant = "danger";
      clearButton.innerText = "Delete";
      clearButton.slot = "suffix";
      const xicon: SlIcon = document.createElement("sl-icon");
      xicon.name = "x";
      xicon.slot = "prefix";
      clearButton.appendChild(xicon);
      clearButton.addEventListener("click", () => {
        const obj = JSON.parse(JSON.stringify(this.mainInstance.internboneValue));
        createPath(obj, newboneName, null, true);

        this.mainInstance.internboneValue = obj;
        this.mainInstance.handleChange("deleteEntry");
        this.mainInstance.boneValue = obj[this.mainInstance.boneName];

      });

      draggable = document.createElement("sl-icon")
      draggable.name = "draggable";
      draggable.addEventListener("mousedown", (e) => {

        if (!this.absolutePostionSet) {
          this.absolutePostionSet = true;

          for (const _input of this.inputsAbsolutePostions) {

            const elemRect = _input[0].getBoundingClientRect();
            const offsetTop = elemRect.top;
            const offsetBottom = elemRect.bottom;
            if (_input.length === 2) {
              _input[1] = [offsetTop, offsetBottom];

            } else {
              _input.push([offsetTop, offsetBottom]);
            }

          }

        }
        if (!this.move) {
          this.move = true;
        }
        e.preventDefault();
        this.moveElement = inputWrapper.cloneNode(true);
        this.moveElement.style.borderStyle = "solid";
        this.moveElement.style.position = "absolute";
        this.moveElement.style.zIndex = "2";
        this.fakeElement = document.createElement("div");
        this.fakeElement.style.height = inputWrapper.clientHeight + "px";
        this.fakeElement.style.width = inputWrapper.clientWidth + "px";
        this.fakeElement.style.backgroundColor = "#fa003e";
        this.startHeight = inputElement.clientHeight;
        this.startTop = inputElement.getBoundingClientRect().top
        inputWrapper.parentElement.insertBefore(this.moveElement, inputWrapper);
        inputWrapper.parentElement.insertBefore(this.fakeElement, inputWrapper);
        inputWrapper.style.display="none";
        this.swapElements[0] = inputElement.dataset.boneName;
        this.moveElementSrc = inputWrapper;


      })


      this.inputsAbsolutePostions.push([inputWrapper])
    }
    if (this.boneStructure["multiple"]) {
      inputWrapper.appendChild(draggable);
    }
    inputWrapper.appendChild(inputElement);
    if (this.boneStructure["multiple"]) {
      inputWrapper.appendChild(clearButton);
    }

    return inputWrapper;
  }

  addErrorContainer(lang: string, index = null): SlDetails {
    const errorContainer: SlDetails = document.createElement("sl-details");
    errorContainer.dataset.name = this.generateboneName(lang, index) + "_errorcontainer";
    errorContainer.style.display = "none";
    errorContainer.summary = "Errors";
    errorContainer.classList.add("error-container");
    return errorContainer;

  }


  getEditor(value: any, boneName = "") {
    switch (this.boneStructure["type"].split(".")[0]) {
      case "str":
        return this.stringBoneEditorRenderer(value, boneName);
      case "numeric":
        return this.numericBoneEditorRenderer(value, boneName);
      case "date":
        return this.dateBoneEditorRenderer(value, boneName);
      case "bool":
        return this.booleanBoneEditorRenderer(value, boneName);
      case "record":
        return this.recordBoneEditorRenderer(value, boneName);
      case "relational":
        if (this.boneStructure["type"].startsWith("relational.tree.leaf.file")) {
          return this.fileBoneEditorRenderer(value, boneName);
        }
        return this.relationBoneEditorRenderer(value, boneName);
      case "select":
        return this.selectBoneEditorRenderer(value, boneName);

      case "spatial":
        return this.spatialBoneEditorRenderer(value, boneName);
      default:
        return this.rawBoneEditorRenderer(value, boneName);
    }

  }


  rawBoneEditorRenderer(value: any, boneName = "") {
    const inputElement = document.createElement("sl-input");

    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;

    if (value === null) {
      inputElement.value = this.boneStructure["emptyValue"];
    } else {
      inputElement.value = value;
    }
    inputElement.addEventListener("sl-change", (change_event) => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });

    inputElement.addEventListener("keypress", (keypress_event) => {

      if (keypress_event.key !== "Enter") return;
      let isValid: boolean = false;
      if (this.boneStructure["required"]) {

        this.mainInstance.bone.querySelectorAll("sl-input").forEach((tmpInput) => {
          if (tmpInput.value !== null) {
            if (tmpInput.value.length > 0) {
              isValid = true;
            }
          }

        })
      } else {
        isValid = true;
      }
      if (isValid) {
        if (inputElement.reportValidity()) {
          this.mainInstance.internboneValue = this.reWriteBoneValue();
          this.mainInstance.handleChange();
        }


      } else {
        //this.mainInstance.bone.querySelector("sl-input").setCustomValidity("Please Fill");

        inputElement.setCustomValidity("Please Fill");


      }

    })

    return inputElement;
  }

  stringBoneEditorRenderer(value: any, boneName = "") {
    //Replace Encoded chars

    return this.rawBoneEditorRenderer(escapeString(value), boneName);
  }


  numericBoneEditorRenderer(value: any, boneName = "") {

    const numericBone = this.rawBoneEditorRenderer(value, boneName);
    numericBone.type = "number";
    numericBone.min = this.boneStructure["min"];
    numericBone.max = this.boneStructure["max"];
    if (this.boneStructure["precision"] > 1) {
      numericBone.step = "0." + "0".repeat(this.boneStructure["precision"] - 1) + "1";
    }

    return numericBone;
  }


  dateBoneEditorRenderer(value: string, boneName = "") {

    const dateBone = this.rawBoneEditorRenderer(value, boneName);

    if (this.boneStructure["time"]) {

      dateBone.type = "datetime-local"
      dateBone.value = value.split('+')[0]
    } else {
      dateBone.type = "date"
      dateBone.value = (new Date(value)).toISOString().substr(0, 10);
    }


    return dateBone;
  }


  booleanBoneEditorRenderer(value: boolean, boneName = "") {

    const inputElement = document.createElement("sl-switch");
    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    inputElement.value = value.toString();


    return inputElement;
  }


  recordBoneEditorRenderer(value: any, boneName = "") {

    const recordboneWrapper = document.createElement("div");
    recordboneWrapper.classList.add("record-wrapper");
    recordboneWrapper.style.paddingTop = "5px";
    recordboneWrapper.style.paddingLeft = "5px";

    recordboneWrapper.style.marginTop = "2px";
    recordboneWrapper.style.marginLeft = "2px";

    recordboneWrapper.style.borderStyle = "solid";
    recordboneWrapper.style.borderWidth = "1px";
    //TODO outsource style

    recordboneWrapper.dataset.boneName = boneName;
    recordboneWrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    recordboneWrapper.dataset.depth = this.depth.toString();

    if (this.boneStructure["multiple"]) {
      const draggable = document.createElement("sl-icon")
      draggable.name = "chevron-bar-expand";
      draggable.id = "dragger";
      recordboneWrapper.appendChild(draggable);
    }

    for (const [_boneName, _boneStructure] of Object.entries(this.boneStructure["using"])) {

      let recordBoneValue: any = null;
      if (value !== null) {
        recordBoneValue = value[_boneName];

      }


      const newBoneName = boneName + "." + _boneName;
      const tmp_renderer = new BoneEditRenderer(_boneStructure, recordBoneValue, newBoneName, this.mainInstance)
      const tmp: HTMLElement = tmp_renderer.boneEditor(true, this.depth + 1);
      tmp.dataset.fromRecord = "true";

      recordboneWrapper.appendChild(tmp);
    }
    if (this.boneStructure["multiple"]) {

      const clearButton: SlButton = document.createElement("sl-button")

      clearButton.id = "clearButton"
      clearButton.variant = "danger";
      clearButton.innerText = "Delete";
      const xicon: SlIcon = document.createElement("sl-icon");
      xicon.name = "x";
      xicon.slot = "prefix";
      clearButton.appendChild(xicon);

      //clearButton.style.float="right";
      recordboneWrapper.appendChild(clearButton);


    }
    recordboneWrapper.addEventListener("submit", (e) => {

      e.preventDefault()
    })
    return recordboneWrapper;


  }


  relationBoneEditorRenderer(value: any, boneName = "") {
    /**
     * value can be :
     * null if a empty bone is renderd (multiple add)
     * key if we are in a add an we extend a multiple value
     * {dest:{name:"bla",key:"blablakey"}}
     *
     *
     */
    if (typeof (value) === "object" && value !== null) {
      if ("dest" in value) {
        const key = value["dest"]["key"]
        this.mainInstance.relationalCache[key] = value;
        value = key;
      }
    }

    const inputWrapper = document.createElement("div");
    const shadowInput = document.createElement("sl-input")
    const searchBox: SlCombobox = document.createElement("sl-combobox");

    const clearButton: SlIconButton = document.createElement("sl-icon-button")
    clearButton.library = "my-icons";
    clearButton.slot = "suffix";
    clearButton.name = "x-circle";
    clearButton.id = "clearButton"
    searchBox.appendChild(clearButton);

    searchBox.hoist = true;
    if (value !== null && value !== "") {
      searchBox.placeholder = formatstring(this.mainInstance.relationalCache[value], this.boneStructure);
    }

    const url = `${apiurl}/json/${this.boneStructure["module"]}/list?search={q}`;


    //searchBox.style.width = "100%";
    //searchBox.style.boxSizing = "border-box";
    searchBox.dataset.boneName = boneName;
    searchBox.name = boneName;

    //Shadow input
    shadowInput.hidden = true;
    shadowInput.name = boneName;
    shadowInput.value = value;


    searchBox.source = (search: string) => {
      return fetch(url.replace('{q}', search))
        .then(res => res.json())
        .then((data) => {

            const skellist = data["skellist"]
            return skellist.map((d: any) => {
              return {
                text: formatstring({dest: d}, this.boneStructure),
                value: d.key
              };

            })
          }
        );
    };
    inputWrapper.appendChild(shadowInput);
    inputWrapper.appendChild(searchBox);

    searchBox.addEventListener("sl-item-select", async (e: CustomEvent) => {
      shadowInput.value = e.detail.item.value;
      await fetch(`${apiurl}/json/${this.boneStructure["module"]}/view/${e.detail.item.value}`)
        .then(response => response.json())
        .then((data) => {
          this.mainInstance.relationalCache[e.detail.item.value] = {dest: data["values"]}
        });

      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
      //this.mainInstance.internboneValue[this.boneName] = {dest: JSON.parse(e.detail.item.value)}
      //this.mainInstance.handleChange(formData);

    });

    return inputWrapper;


  }


  fileBoneEditorRenderer(value: any, boneName = "") {
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
    if(value!==null)
    {
      shadowKey.value = value;
    }


    shadowFile.addEventListener("change", (e: Event) => {

      const file: File = e.target.files[0];
      getUploadUrl(file).then(uploadData => {

        fileNameInput.value = "Uploading...";
        uploadFile(file, uploadData).then(resp => {


          addFile(uploadData).then((fileData: object) => {
            this.mainInstance.relationalCache[fileData["values"]["key"]] = {dest:fileData["values"]}

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


  selectBoneEditorRenderer(value: any, boneName = "") {

    const inputSelect: SlSelect = document.createElement("sl-select");

    inputSelect.name = boneName;
    inputSelect.value = value;
    inputSelect.dataset.boneName = boneName;
    //inputSelect.hoist = true; //Todo styling

    inputSelect.multiple = this.boneStructure["multiple"];
    for (const option of this.boneStructure["values"]) {
      const optionElement = document.createElement("sl-menu-item");
      optionElement.value = option[0];
      optionElement.innerText = option[1];
      inputSelect.appendChild(optionElement);

    }
    inputSelect.addEventListener("sl-change", (event) => {

      const obj = this.reWriteBoneValue();
      this.mainInstance.internboneValue = obj;
      this.mainInstance.handleChange();
      this.mainInstance.boneValue = obj[this.mainInstance.boneName];

    });

    return inputSelect;

  }

  spatialBoneEditorRenderer(value: any, boneName = "") {
    const spatialWrapper = document.createElement("div");
    const lat = value[0];
    const lng = value[1];

    const latInput = this.rawBoneEditorRenderer(lat, boneName + ".lat");
    latInput.type = "number";

    latInput.min = this.boneStructure["boundsLat"][0];
    latInput.max = this.boneStructure["boundsLat"][1];
    latInput.step = "any";
    spatialWrapper.appendChild(latInput);

    const lngInput = this.rawBoneEditorRenderer(lng, boneName + ".lng");
    lngInput.type = "number";
    lngInput.min = this.boneStructure["boundsLng"][0];
    lngInput.max = this.boneStructure["boundsLng"][1];
    lngInput.step = "any";
    spatialWrapper.appendChild(lngInput);
    return spatialWrapper;
  }

  reWriteBoneValue() {
    const obj = {};
    this.mainInstance.bone.querySelectorAll("sl-input,sl-select").forEach((inputElement: HTMLElement) => {

      if (inputElement.name !== undefined) {
        if (inputElement.dataset.relational === "true") {
          createPath(obj, inputElement.name, inputElement.value);//createPath(obj, inputElement.name, this.mainInstance.relationalCache[inputElement.value]);
        } else {
          createPath(obj, inputElement.name, inputElement.value);
        }

      }


    });
    return obj;
  }

  /**
   * Move Element functions
   * Set ne values for the absolute positon for the inputs
   */
  addScroll() {
    document.addEventListener("scroll", () => {
      for (const _input of this.inputsAbsolutePostions) {

        const elemRect = _input[0].getBoundingClientRect();
        const offsetTop = elemRect.top;
        const offsetBottom = elemRect.bottom;
        if (_input.length === 2) {
          _input[1] = [offsetTop, offsetBottom];

        } else {
          _input.push([offsetTop, offsetBottom]);
        }


      }
    })
  }

  addMouseUp() {

    document.addEventListener("mouseup", (e) => {
      if (this.move) {
        e.preventDefault();
        this.move = false;
        this.fakeElement.remove();
        this.moveElement.remove();
        console.log("switch",this.swapElements)
        if (this.swapElements[0] !== null && this.swapElements[1] !== null) {
          const obj = this.reWriteBoneValue();
          const _value = getPath(obj, this.swapElements[0]);
          console.log("obj",obj);
          console.log("value",_value);
          createPath(obj, this.swapElements[0], null, true,);
          createPath(obj, this.swapElements[1], _value, false, true);

          this.mainInstance.internboneValue = obj;
          this.mainInstance.handleChange();
          this.mainInstance.boneValue = obj[this.mainInstance.boneName];

        } else {//override with same value because that trigger rerender and we must not insert the old bone
          const obj = JSON.parse(JSON.stringify(this.mainInstance.internboneValue));
          this.mainInstance.boneValue = obj[this.mainInstance.boneName];
        }


      }


    })
  }

  addMouseMove() {
    let elemetBefor = null;
    let elemetAfter = null;
    document.addEventListener("mousemove", (e: MouseEvent) => {
        if (this.move) {
          if (this.mainInstance.inTable) {
            this.moveElement.style.top = (e.pageY - (this.startHeight / 2) - this.mainInstance.getBoundingClientRect().top).toString() + "px";//in of table
          } else {
            this.moveElement.style.top = (e.pageY - (this.startHeight / 2)).toString() + "px";//out of table
          }

          //this.moveElement.style.top = yPos  + "px";
          const y = e.clientY;

          for (const tmpPos of this.inputsAbsolutePostions) {

            if (y > tmpPos[1][0])//top
            {
              if (y < tmpPos[1][1])//bottom
              {
                if (this.moveElementSrc === tmpPos[0]) {
                  break;
                }
                if (y - tmpPos[1][0] < (tmpPos[1][1] - tmpPos[1][0]) / 2) {
                  if (elemetBefor !== tmpPos[0]) {
                    elemetBefor = tmpPos[0];
                    const parent = tmpPos[0].parentElement;
                    if (parent) {
                      this.fakeElement.remove();
                      parent.insertBefore(this.fakeElement, tmpPos[0]);
                      this.swapElements[1] = tmpPos[0].dataset.boneName;
                    }
                  }
                } else {
                  if (elemetAfter !== tmpPos[0]) {
                    elemetAfter = tmpPos[0];
                    this.fakeElement.remove();
                    tmpPos[0].after(this.fakeElement);
                    this.swapElements[1] = tmpPos[0].dataset.boneName;
                  }


                }
                break;
              }
            }
          }
        }
      }
    )
  }

}

/////////////////HELPER FUNCTRIONS/////////////////
function getSkey() {
  return new Promise((resolve, reject) => {

    fetch(`${apiurl}/json/skey`).then(response => response.json()).then((skey) => {
      resolve(skey)
    }).catch((reason) => {
      reject(reason)
    })

  })
}

function createPath(obj: object, path: string | string[], value: any | null = null, mustdelete = false, mustsplice = false) {

  path = typeof path === 'string' ? path.split('.') : path;
  let current: object = obj;


  while (path.length > 1) {

    const [head, ...tail] = path;
    path = tail;


    if (current[head] === undefined) {
      if (Number.isNaN(parseInt(tail[0]))) {
        current[head] = {}
      } else {
        current[head] = []
      }
    }
    current = current[head];
  }
  if (mustdelete) {
    current.splice(path[0], 1);
  } else {
    if (mustsplice) {
      current.splice(path[0], 0, value);
    } else {
      current[path[0]] = value;
    }

  }

  return obj;


}

/////////////////FILEBONE FUNCTRIONS/////////////////

function getUploadUrl(file: File) {
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

function uploadFile(file: File, uploadData: any) {

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

function addFile(uploadData: any) {


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
