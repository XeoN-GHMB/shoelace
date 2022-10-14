import {html} from "lit";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {formatstring, createPath, getPath} from "../utils";
import SlIcon from "../../icon/icon";
import SlDetails from "../../details/details";
import {getPath} from "../utils";
import SlSwitch from "../../switch/switch";

interface BoneStructure {
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

export class RawBone {
  boneValue;
  boneName;
  boneStructure: BoneStructure;
  mainInstance;
  depth = 0;
  //Move Element
  move = false;
  moveElement;
  startHeight = 0;
  startTop = 0;
  fakeElement;
  inputsAbsolutePostions = [];
  absolutePostionSet = false;
  swapElements = [null, null];
  moveElementSrc: HTMLElement;
  movePath = null;
  moveLang = null;

  constructor( boneName = "",boneValue: any, boneStructure = {}, mainInstance = null) {
    this.boneValue = boneValue;
    this.boneName = boneName;
    this.boneStructure = boneStructure;
    this.mainInstance = mainInstance;
  }

  view(formater: Function = formatstring) {
    if (this.boneValue === null) {
      return "-";
    }
    if (this.boneStructure["languages"] !== null) {


      return html`
        <sl-tab-group>
          ${this.getTabs()}
          ${this.getTabPannels(formater)}
        </sl-tab-group>`;

    } else {


      if (this.boneStructure["multiple"]) {
        if (!Array.isArray(this.boneValue)) {
          this.boneValue = [this.boneValue];
        }
        for (const index in this.boneValue) {

          this.boneValue[index] = formater(this.boneValue[index], this.boneStructure, null);
        }
        return html`${this.boneValue.map((val: any) => [
          html`${val}<br>`
        ])}`


      }
    }
    if (this.boneStructure["type"].startsWith("text")) {
      return html`${unsafeHTML(this.boneValue)}`;
    }
    return formater(this.boneValue, this.boneStructure)
  }


  getTabs() {
    let tabs: any = [];
    for (const lang of this.boneStructure["languages"]) {

      tabs.push(html`
        <sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`);
    }
    return tabs
  }


  getTabPannels(formater: Function = formatstring) {
    //We are when languages not null
    let tabpannels: any = [];
    if (this.boneStructure["format"] === undefined) {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {
          if (!Array.isArray(this.boneValue[lang])) {
            this.boneValue[lang] = [this.boneValue[lang]];
          }
          tabpannels.push(html`
            <sl-tab-panel name="${lang}"> ${this.boneValue[lang].map((val: any) => [html`${val}<br>`])}
            </sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">-</sl-tab-panel>`);
          } else {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">${this.boneValue[lang].toString()}</sl-tab-panel>`);
          }

        }
      }
    } else {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {

          console.log("call format", this.boneValue,)
          this.boneValue[lang] = formater(this.boneValue, this.boneStructure, lang);


          tabpannels.push(html`
            <sl-tab-panel name="${lang}">${this.boneValue[lang].map((val: any) => [html`${val}<br>`])}</sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpannels += html`
              <sl-tab-panel name="${lang}">-</sl-tab-panel>`;
          } else {
            tabpannels.push(html`
              <sl-tab-panel name="${lang}">${formater(this.boneValue, this.boneStructure, lang)}</sl-tab-panel>`);
          }

        }
      }
    }
    return tabpannels;

  }

  edit(fromRecord: boolean = false, depth: number): HTMLElement {

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
      boneNameLabel.classList.add("bone-name")
      wrapper.appendChild(boneNameLabel);
    }


    if (this.boneStructure["languages"] !== null) {


      const tabGroup = document.createElement("sl-tab-group");
      tabGroup.setAttribute("placement", "bottom");
      tabGroup.classList.add("language-tab-group");
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
          if (this.boneValue === null) continue;
          if (this.boneValue[lang] === undefined) continue;
          if (this.boneValue[lang] === null) continue;
          let [multipleWrapper, idx] = this.createMultipleWrapper(this.boneValue[lang], lang)
          multipleWrapper.classList.add("multiple-wrapper");


          const addButton = document.createElement("sl-button");

          addButton.addEventListener("click", () => {
            console.log("add")
            multipleWrapper.appendChild(this.addInput(this.boneStructure["emptyValue"], lang, idx));
            multipleWrapper.appendChild(this.addErrorContainer(lang, idx));
            idx += 1;
            return
            const obj = this.reWriteBoneValue();
            createPath(obj, this.generateboneName(lang, idx), this.boneStructure["emptyValue"]);
            this.mainInstance.boneValue = obj[this.mainInstance.boneName];

          });
          languageWrapper.appendChild(multipleWrapper);
          addButton.innerText = "Add";
          addButton.variant = "success";

          const clearButton = document.createElement("sl-button");

          clearButton.addEventListener("click", () => {
            this.clearMultipleWrapper(lang)

          });
          clearButton.innerText = "Clear";
          clearButton.id = "clearButton"
          clearButton.variant = "danger";
          const xicon: SlIcon = document.createElement("sl-icon");
          xicon.name = "x";
          xicon.slot = "suffix";
          clearButton.appendChild(xicon);
          clearButton.variant = "danger";

          //Undo Button
          const undoButton = document.createElement("sl-button");
          undoButton.addEventListener("click", () => {
            this.undo(lang)
          });
          undoButton.dataset.name = "undoBtn." + this.boneName + "." + lang
          undoButton.innerText = "Undo";
          undoButton.variant = "neutral";
          undoButton.style.display = "none";


          tab_panel.appendChild(addButton);
          tab_panel.appendChild(clearButton);
          tab_panel.appendChild(undoButton);
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

        const addButton = document.createElement("sl-button");
        const addIcon = document.createElement("sl-icon");

        addIcon.setAttribute("name", "plus")
        addButton.appendChild(addIcon);
        addButton.setAttribute("variant", "success")
        addButton.setAttribute("outline", "")
        addButton.classList.add("add-button")
        addButton.variant = "success"
        let [multipleWrapper, idx] = this.createMultipleWrapper(this.boneValue)
        addButton.addEventListener("click", () => {
          console.log("add")
          const mulWrapper = this.mainInstance.bone.querySelector('[data-multiplebone="' + this.boneName + '"]');
          mulWrapper.appendChild(this.addInput(this.boneStructure["emptyValue"], null, idx));
          mulWrapper.appendChild(this.addErrorContainer(null, idx));
          idx += 1;
          return
          /*const obj = this.reWriteBoneValue();
          console.log("add", obj);
          console.log("add name", this.generateboneName(null, idx));
          createPath(obj, this.generateboneName(null, idx), this.boneStructure["emptyValue"]);
          this.mainInstance.boneValue = obj[this.mainInstance.boneName];*/

        });

        const innerWrap = document.createElement("div");
        innerWrap.classList.add("bone-inner-wrap")

        innerWrap.appendChild(multipleWrapper)

        const clearButton = document.createElement("sl-button");
        const clearIcon = document.createElement("sl-icon");

        clearIcon.setAttribute("name", "x")
        clearButton.appendChild(clearIcon);
        clearButton.setAttribute("variant", "danger")
        clearButton.setAttribute("outline", "")
        clearButton.classList.add("clear-button")
        clearButton.addEventListener("click", () => {
          this.clearMultipleWrapper()
        });
        clearButton.variant = "danger";

        //Undo Button
        const undoButton = document.createElement("sl-button");
        undoButton.addEventListener("click", () => {
          this.undo()

        });
        undoButton.dataset.name = "undoBtn." + this.boneName
        undoButton.innerText = "Undo";
        undoButton.variant = "neutral";
        undoButton.style.display = "none";

        const buttonWrap = document.createElement("div");
        buttonWrap.classList.add("bone-inner-button-wrap")

        buttonWrap.appendChild(addButton);
        buttonWrap.appendChild(undoButton);
        buttonWrap.appendChild(clearButton);

        innerWrap.appendChild(buttonWrap)

        wrapper.appendChild(innerWrap);


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
      const self = this;
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

  createMultipleWrapper(value: any, lang: any = null): [HTMLElement, number] {

    const multipleWrapper = document.createElement("div");
    multipleWrapper.classList.add("multiple-wrapper");
    const path = lang === null ? this.boneName : this.boneName + "." + lang
    multipleWrapper.dataset.multiplebone = path;

    let idx: number = 0;
    for (const [i, tmpValue] of value.entries()) {

      multipleWrapper.appendChild(this.addInput(tmpValue, lang, i));
      multipleWrapper.appendChild(this.addErrorContainer(lang, i));

      idx += 1;

    }
    this.addScroll();
    this.addMouseMove();
    this.addMouseUp();
    return [multipleWrapper, idx];


  }

  getEditor(value: any, boneName: string) {

    const inputElement = document.createElement("sl-input");

    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    inputElement.disabled = this.boneStructure["readonly"];

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

  addInput(value: any, lang: string, index = null) {
    const inputWrapper = document.createElement("div");
    const newboneName = this.generateboneName(lang, index);
    const path = lang === null ? this.boneName : this.boneName + "." + lang

    inputWrapper.classList.add("multi-input");
    inputWrapper.dataset.boneName = newboneName;

    let deleteButton;
    let draggable
    const inputElement: HTMLElement = this.getEditor(value, newboneName);
    inputElement.dataset.lang = lang;
    inputElement.dataset.multiple = this.boneStructure["multiple"];

    if (this.boneStructure["multiple"]) {

      deleteButton = document.createElement("sl-button");
      deleteButton.id = "clearButton"
      deleteButton.classList.add("clear-button");
      deleteButton.variant = "danger";
      deleteButton.slot = "suffix";
      const xicon: SlIcon = document.createElement("sl-icon");
      xicon.name = "x";
      xicon.slot = "prefix";
      deleteButton.appendChild(xicon);
      deleteButton.setAttribute("outline", "")
      deleteButton.addEventListener("click", () => {
        this.saveState(lang);

        let obj = JSON.parse(JSON.stringify(this.mainInstance.internboneValue));
        createPath(obj, newboneName, null, true);
        this.mainInstance.internboneValue = obj;
        obj = this.reWriteBoneValue();
        createPath(obj, newboneName, null, true);
        this.mainInstance.handleChange("deleteEntry");

        const mulWrapper = this.mainInstance.bone.querySelector('[data-multiplebone="' + path + '"]');
        if (mulWrapper !== null) {
          let [element, index] = this.createMultipleWrapper(getPath(obj, path),lang)
          mulWrapper.replaceWith(element);
        }
        const undoButton = this.mainInstance.bone.querySelector('[data-name="' + "undoBtn." + path + '"]');
        undoButton.style.display = "";

        //this.mainInstance.boneValue = obj[this.mainInstance.boneName];

      });

      draggable = document.createElement("sl-icon")
      draggable.name = "draggable";
      draggable.classList.add("drag-button");
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
        this.moveElement.classList.add("is-dragged");
        this.fakeElement = document.createElement("div");
        this.fakeElement.style.height = inputWrapper.clientHeight + "px";
        this.fakeElement.style.width = inputWrapper.clientWidth + "px";
        this.fakeElement.classList.add("fake-drag-element");
        this.startHeight = inputElement.clientHeight;
        this.startTop = inputElement.getBoundingClientRect().top
        inputWrapper.parentElement.insertBefore(this.moveElement, inputWrapper);
        inputWrapper.parentElement.insertBefore(this.fakeElement, inputWrapper);
        inputWrapper.style.display = "none";
        this.swapElements[0] = inputElement.dataset.boneName;
        this.movePath = path;
        this.moveLang = lang;
        this.moveElementSrc = inputWrapper;


      })


      this.inputsAbsolutePostions.push([inputWrapper])

    }
    if (this.boneStructure["multiple"]) {
      inputWrapper.appendChild(draggable);
    }
    inputWrapper.appendChild(inputElement);
    if (this.boneStructure["multiple"]) {
      inputWrapper.appendChild(deleteButton);
    }

    return inputWrapper;
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

  addErrorContainer(lang: string, index = null): SlDetails {
    const errorContainer: SlDetails = document.createElement("sl-details");
    errorContainer.dataset.name = this.generateboneName(lang, index) + "_errorcontainer";
    errorContainer.style.display = "none";
    errorContainer.summary = "Errors";
    errorContainer.classList.add("error-container");
    return errorContainer;

  }

  /**
   * Move Element functions
   * Set new values for the absolute positon for the inputs
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

        if (this.swapElements[0] !== null && this.swapElements[1] !== null) {
          const obj = this.reWriteBoneValue();
          const _value = getPath(obj, this.swapElements[0]);

          createPath(obj, this.swapElements[0], null, true,);
          createPath(obj, this.swapElements[1], _value, false, true);

          this.mainInstance.internboneValue = obj;
          this.mainInstance.handleChange();

          const mulWrapper = this.mainInstance.bone.querySelector('[data-multiplebone="' + this.movePath + '"]');
          if (mulWrapper !== null) {
            let [element, index] = this.createMultipleWrapper(getPath(obj, this.movePath), this.moveLang)
            mulWrapper.replaceWith(element);

          }


          //this.mainInstance.boneValue = obj[this.mainInstance.boneName];

        } else {
          //override with same value because that trigger rerender and we must not insert the old bone
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
    })
  }

  reWriteBoneValue() {
    const obj = {};
    this.mainInstance.bone.querySelectorAll("sl-input,sl-select").forEach((inputElement: HTMLElement) => {
      if (inputElement.name !== undefined) {
        createPath(obj, inputElement.name, inputElement.value);
      }

    });
    this.mainInstance.bone.querySelectorAll("sl-switch").forEach((inputElement: SlSwitch) => {
      if (inputElement.name !== undefined) {
        createPath(obj, inputElement.name, inputElement.checked);
      }

    });
    return obj;
  }

  saveState(lang = null) {
    const path = lang === null ? this.boneName : this.boneName + "." + lang;
    if (this.mainInstance.previousBoneValues[path] === undefined) {
      this.mainInstance.previousBoneValues[path] = []
    }
    const obj = this.reWriteBoneValue();
    this.mainInstance.previousBoneValues[path].push(getPath(obj, path));

  }

  undo(lang = null) {
    const path = lang === null ? this.boneName : this.boneName + "." + lang
    const mulWrapper = this.mainInstance.bone.querySelector('[data-multiplebone="' + path + '"]');

    const obj = this.mainInstance.previousBoneValues[path].pop();
    let [element, index] = this.createMultipleWrapper(obj, lang);
    mulWrapper.replaceWith(element);
    this.mainInstance.internboneValue = this.reWriteBoneValue();
    const undoButton = this.mainInstance.bone.querySelector('[data-name="' + "undoBtn." + path + '"]');
    if(this.mainInstance.previousBoneValues[path].length===0)
    {
       undoButton.style.display = "none";
    }

  }

  clearMultipleWrapper(lang: any = null) {
    const path = lang === null ? this.boneName : this.boneName + "." + lang
    const mulWrapper = this.mainInstance.bone.querySelector('[data-multiplebone="' + path + '"]');
    this.saveState(lang);
    mulWrapper.innerHTML = "";//Clear Wrapper;
    this.mainInstance.internboneValue = this.reWriteBoneValue();

    const undoButton = this.mainInstance.bone.querySelector('[data-name="' + "undoBtn." + path + '"]');

    undoButton.style.display = "";

  }


}



