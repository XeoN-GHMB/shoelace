// @ts-nocheck
import {html} from "lit";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {getPath, formatstring, createPath, getPath, translate} from "../utils";
import type SlAlert from "../../alert/alert";
import type SlAvatar from "../../avatar/avatar";
import type SlButton from "../../button/button";
import type SlColorPicker from "../../color-picker/color-picker";
import type SlDetails from "../../details/details";
import type SlIcon from "../../icon/icon";
import type SlInput from "../../input/input";
import type SlSelect from "../../select/select";
import type SlSwitch from "../../switch/switch";
import type SlTooltip from "../../tooltip/tooltip";
import type SlBone from "../bone";
import type {BoneStructure} from "../interfaces";
import type {TemplateResult} from "lit";

export type  LangBoneValue = Record<string, BoneValue> | Record<string, BoneValue[]>;
export type  MultiBoneValue = BoneValue[];
export type BoneValue = string | number | boolean | null | LangBoneValue | MultiBoneValue;// todo bone ? what can all happend?


export class RawBone {
  boneValue: BoneValue;
  boneName;
  boneStructure: BoneStructure;
  mainInstance: SlBone;
  depth = 0;
  //Move Element
  move = false;
  moveElement: HTMLElement;
  startHeight = 0;
  startTop = 0;
  fakeElement: HTMLElement;
  inputsAbsolutePostions: any[] = [];
  absolutePostionSet = false;
  swapElements = [null, null];
  moveElementSrc: HTMLElement;
  movePath: string | null = null;
  moveLang: string | null = null;

  idx: number | Record<string, number> | null = null;

  constructor(boneName: string, boneValue: BoneValue, boneStructure: BoneStructure, mainInstance = null) {

    this.boneName = boneName;
    this.boneValue = boneValue;
    this.boneStructure = boneStructure;
    this.mainInstance = mainInstance;
  }

  view(formater: () => BoneValue = formatstring) {
    if (this.boneValue === null) {
      return html`<div part="bonevalue">-</div>`;
    }
    if (this.boneStructure["languages"] !== null) {


      return html`
        <sl-tab-group class="language-tab-group view" placement="bottom">
          ${this.getTabs()}
          ${this.getTabPannels(formater)}
        </sl-tab-group>`;

    }


    if (this.boneStructure["multiple"]) {
      if (!Array.isArray(this.boneValue)) {
        this.boneValue = [this.boneValue];
      }
      for (const index in this.boneValue) {

        this.boneValue[index] = formater(this.boneValue[index], this.boneStructure, null);
      }
      return html`${this.boneValue.map((val: any) => [
        html`<div part="bonevalue">${val}</div>`
      ])}`


    }

    return html`<div part="bonevalue">${formater(this.boneValue, this.boneStructure)}</div>`
  }


  getTabs(): TemplateResult[] {
    const tabs: TemplateResult[] = [];
    for (const lang of this.boneStructure["languages"]) {

      tabs.push(html`
        <sl-tab slot="nav" panel="${lang}">${lang}</sl-tab>`);
    }
    return tabs
  }


  getTabPannels(formater: () => BoneValue = formatstring): TemplateResult[] {
    //We are when languages not null
    const tabpanels: TemplateResult[] = [];
    if (this.boneStructure["format"] === undefined) {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {
          if (!Array.isArray(this.boneValue[lang])) {
            this.boneValue[lang] = [this.boneValue[lang]];
          }
          tabpanels.push(html`
            <sl-tab-panel name="${lang}"> ${this.boneValue[lang].map((val: any) => [html`<div part="bonevalue">${val}</div>`])}
            </sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpanels.push(html`
              <sl-tab-panel name="${lang}"><div part="bonevalue">-</div></sl-tab-panel>`);
          } else {
            tabpanels.push(html`
              <sl-tab-panel name="${lang}"><div part="bonevalue">${this.boneValue[lang].toString()}</div></sl-tab-panel>`);
          }

        }
      }
    } else {
      if (this.boneStructure["multiple"]) {
        for (const lang of this.boneStructure["languages"]) {

          this.boneValue[lang] = formater(this.boneValue, this.boneStructure, lang);


          tabpanels.push(html`
            <sl-tab-panel name="${lang}">${this.boneValue[lang].map((val: any) => [html`<div part="bonevalue">${val}</div>`])}</sl-tab-panel>`);
        }
      } else {

        for (const lang of this.boneStructure["languages"]) {
          if (this.boneValue[lang] === null) {
            tabpanels.push(html`
              <sl-tab-panel name="${lang}"><div part="bonevalue">-</div></sl-tab-panel>`);
          } else {
            tabpanels.push(html`
              <sl-tab-panel name="${lang}"><div part="bonevalue">${formater(this.boneValue, this.boneStructure, lang)}</div></sl-tab-panel>`);
          }

        }
      }
    }
    return tabpanels;

  }

  edit(fromRecord = false, depth: number | null = null): HTMLElement {

    if (depth !== null) {
      this.depth = depth;
    }

    let wrapper: HTMLElement;
    if (fromRecord) {
      wrapper = document.createElement("div");

    } else {
      wrapper = document.createElement("div"); //todo can be a div or must be a form
      /*
      wrapper.addEventListener("submit", (e: Event) => {

        e.preventDefault()
        return false;
      })*/


    }

    wrapper.classList.add(`bone-type-${this.boneStructure["type"].split(".", 1)}`)

    if (this.boneStructure["using"] !== null && this.boneStructure["using"] !== undefined) {
      wrapper.classList.add(`bone-type-using`);
    }
    // Check if bone is rendered in table and render in small compact view
    if (this.mainInstance.inTable) {
      wrapper.classList.add("bone-table-wrapper")
    } else {
      wrapper.classList.add("bone-wrapper")
    }

    wrapper.dataset.boneWrapper = "true";
    wrapper.dataset.multiple = this.boneStructure["multiple"].toString();
    wrapper.dataset.boneName = this.boneName;
    if (this.mainInstance.renderLabel) {
      const boneNameLabel = document.createElement("div");
      boneNameLabel.innerText = this.boneStructure["descr"].length > 0 ? this.boneStructure["descr"] : this.boneName;
      boneNameLabel.classList.add("bone-name")
      if (this.boneStructure["params"]?.["tooltip"]) {
        const tooltip: SlTooltip = document.createElement("sl-tooltip");
        const avatar: SlAvatar = document.createElement("sl-avatar");
        const icon: SlIcon = document.createElement("sl-icon");
        avatar.classList.add("tooltip-bubble");
        icon.setAttribute("name", "question");
        icon.setAttribute("slot", "icon");
        icon.classList.add("tooltip-icon");
        avatar.appendChild(icon);
        tooltip.content = this.boneStructure["params"]["tooltip"];
        tooltip.classList.add("tooltip");
        tooltip.appendChild(avatar);
        boneNameLabel.appendChild(tooltip);
      }
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
          if (this.boneValue === null) {
            this.boneValue = {}

            for (const lang of this.boneStructure["languages"]) {
              this.boneValue[lang] = []
            }
          }
          // Lang and Mul
          if (this.boneValue === null) continue;
          if (this.boneValue[lang] === undefined) continue;
          if (this.boneValue[lang] === null) continue;

          const [multipleWrapper, idx] = this.createMultipleWrapper(this.boneValue[lang], lang);
          if (this.idx === null) {
            this.idx = {};
          }
          this.idx[lang] = idx;
          multipleWrapper.classList.add("multiple-wrapper");
          multipleWrapper.dataset.multiplebone = `${this.boneName}.${lang}`

          const addButton = this.getaddButton(lang);


          languageWrapper.appendChild(multipleWrapper);


          const clearButton = this.getclearButton(lang)

          //Undo Button
          const undoButton = this.getundoButton(lang)

          const buttonWrap = document.createElement("div");
          buttonWrap.classList.add("bone-inner-button-wrap")

          buttonWrap.appendChild(clearButton);
          buttonWrap.appendChild(this.getplaceHolder(lang));
          buttonWrap.appendChild(undoButton);
          buttonWrap.appendChild(addButton);


          tab_panel.appendChild(languageWrapper);
          if (!this.boneStructure["readonly"]) {
            tab_panel.appendChild(buttonWrap)
          }
          this.addScroll();
          this.addMouseMove();
          this.addMouseUp();
        } else {
          //Lang , no multipler
          const languageWrapper = document.createElement("div");
          languageWrapper.classList.add("language-wrapper");
          if (this.boneValue !== null && this.boneValue !== undefined) {
            languageWrapper.appendChild(this.addInput(this.boneValue[lang], lang));
          } else {
            languageWrapper.appendChild(this.addInput(null, lang));
          }

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
        const addButton = this.getaddButton();


        const [multipleWrapper, idx] = this.createMultipleWrapper(this.boneValue);
        this.idx = idx;

        const innerWrap = document.createElement("div");
        innerWrap.classList.add("bone-inner-wrap")

        innerWrap.appendChild(multipleWrapper)

        const clearButton = this.getclearButton();
        //Undo Button
        const undoButton = this.getundoButton()

        const buttonWrap = document.createElement("div");
        buttonWrap.classList.add("bone-inner-button-wrap")

        buttonWrap.appendChild(clearButton);
        buttonWrap.appendChild(this.getplaceHolder());
        buttonWrap.appendChild(undoButton);
        buttonWrap.appendChild(addButton);
        innerWrap.appendChild(buttonWrap);
        innerWrap.appendChild(this.addErrorContainer());// default error container if no input in in mul wrapper
        wrapper.appendChild(innerWrap);


      } else {
        //No Lang, No Multiple
        const inputElement: HTMLElement = this.getEditor(this.boneValue, this.boneName);
        inputElement.dataset.lang = "null";
        inputElement.dataset.multiple = this.boneStructure["multiple"];

        wrapper.appendChild(inputElement);
        wrapper.appendChild(this.addErrorContainer());


      }
    }

    if (!fromRecord) {
      if (this.mainInstance.rendersaveButton) {
        const saveButton = document.createElement("sl-button");
        saveButton.classList.add("save-button");
        saveButton.variant = "success";
        saveButton.innerText = "Save";
        saveButton.addEventListener("click", () => {
          this.mainInstance.handleChange("fromSave");
        })
        wrapper.appendChild(saveButton);
      }


    }

    return wrapper;
  }

  createMultipleWrapper(value: any, lang: string | null = null): [HTMLElement, number] {

    const multipleWrapper = document.createElement("div");
    multipleWrapper.classList.add("multiple-wrapper");
    const path = lang === null ? this.boneName : `${this.boneName}.${lang}`;
    multipleWrapper.dataset.multiplebone = path;

    let idx = 0;
    if(value===undefined || value===null)
    {
      value=[];
    }
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

  getEditor(value: BoneValue, boneName: string, lang: string | null = null) {

    const inputElement: SlInput = document.createElement("sl-input");

    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;

    if (this.boneStructure["readonly"] || this.mainInstance.disabled) {
      inputElement.disabled = true;
    }

    if (value === null || value === undefined) {
      inputElement.value = this.boneStructure["emptyvalue"];
    } else {
      inputElement.value = value;
    }
    inputElement.addEventListener("sl-change", (change_event) => {
      this.mainInstance.internboneValue = this.reWriteBoneValue();
      this.mainInstance.handleChange();
    });

    inputElement.addEventListener("keypress", (keypress_event) => {

      if (keypress_event.key !== "Enter") return;
      let isValid = false;
      if (this.boneStructure["required"]) {

        this.mainInstance.bone.querySelectorAll("sl-input").forEach((tmpInput: SlInput) => {
          if (tmpInput.value !== null && value !== undefined) {
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

  addInput(value: any, lang: string, index: number | null = null) {
    const inputWrapper: HTMLDivElement = document.createElement("div");
    const newboneName = this.generateboneName(lang, index);
    const path = lang === null ? this.boneName : `${this.boneName}.${lang}`;
    if(this.boneStructure["multiple"])
    {
       inputWrapper.classList.add("multi-input");
    }

    inputWrapper.dataset.boneName = newboneName;

    let deleteButton;
    let draggable;
    let draggableIcon;
    const inputElement: HTMLElement = this.getEditor(value, newboneName, lang);
    inputElement.dataset.boneName = newboneName;
    inputElement.dataset.lang = lang;
    inputElement.dataset.multiple = this.boneStructure["multiple"];
    inputElement.placeholder = this.boneStructure["descr"];

    if (this.boneStructure["multiple"]) {

      deleteButton = document.createElement("sl-button");
      deleteButton.id = "clearButton"
      deleteButton.classList.add("clear-button");
      deleteButton.title = translate("actions.delete");
      deleteButton.variant = "danger";
      deleteButton.slot = "suffix";
      const xicon: SlIcon = document.createElement("sl-icon");
      xicon.name = "x";
      xicon.slot = "prefix";
      deleteButton.appendChild(xicon);
      deleteButton.setAttribute("outline", "")
      deleteButton.addEventListener("click", () => {
        this.saveState(lang);
        this.mainInstance.internboneValue = this.reWriteBoneValue();
        const obj: object = JSON.parse(JSON.stringify(this.mainInstance.internboneValue));

        createPath(obj, newboneName, null, true);
        const multipleWrapper = this.mainInstance.bone.querySelector(`[data-multiplebone='${path}']`);

        if (getPath(obj, path).length === 0)//clear last element
        {

          this.clearMultipleWrapper(lang)
          this.mainInstance.internboneValue = {[this.boneName]: [""]};// set the bone value to emtpy sting to delete it in the backend
          this.mainInstance.handleChange("deleteEntry");
          return;
        }
        if (multipleWrapper !== null) {

          const [element, idx] = this.createMultipleWrapper(getPath(obj, path), lang);
          if (lang) {
            if (this.idx === null) {
              this.idx = {};
            }
            this.idx[lang] = idx;
          } else {
            this.idx = idx;
          }

          multipleWrapper.replaceWith(element);
          this.mainInstance.internboneValue = this.reWriteBoneValue();
          this.mainInstance.handleChange("deleteEntry");
        }
        const undoButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='undoBtn.${path}']`);
        undoButton.style.display = "";

        //this.mainInstance.boneValue = obj[this.mainInstance.boneName];

      });

      draggable = document.createElement("div");
      draggableIcon = document.createElement("sl-icon");
      draggableIcon.name = "draggable";
      draggable.appendChild(draggableIcon);
      draggable.classList.add("drag-button");
      draggable.addEventListener("mousedown", (e) => {

        if (!this.absolutePostionSet) {
          this.absolutePostionSet = true;

          for (const _input: Array<HTMLElement, Array<number, number>> of this.inputsAbsolutePostions) {

            const elemRect: DOMRect = _input[0].getBoundingClientRect();
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
        this.fakeElement.style.height = `${inputWrapper.clientHeight}px`;
        this.fakeElement.style.width = `${inputWrapper.clientWidth}px`;
        this.fakeElement.classList.add("fake-drag-element");
        this.startHeight = inputElement.clientHeight;
        this.startTop = inputElement.getBoundingClientRect().top
        inputWrapper.parentElement.insertBefore(this.moveElement, inputWrapper);
        inputWrapper.parentElement.insertBefore(this.fakeElement, inputWrapper);
        inputWrapper.style.display = "none";
        console.log("set bone  in swap ", inputElement.dataset.boneName)
        this.swapElements[0] = inputElement.dataset.boneName;
        this.movePath = path;
        this.moveLang = lang;
        this.moveElementSrc = inputWrapper;


      })


      this.inputsAbsolutePostions.push([inputWrapper])

    }
    if (this.boneStructure["multiple"] && !this.boneStructure["readonly"]) {
      inputWrapper.appendChild(draggable);
    }
    inputWrapper.appendChild(inputElement);
    if (this.boneStructure["multiple"] && !this.boneStructure["readonly"]) {
      inputWrapper.appendChild(deleteButton);
    }

    return inputWrapper;
  }

  generateboneName(lang: string | null = null, index: number | null = null) {
    let newboneName = this.boneName;
    if (lang !== null) {
      newboneName += `.${lang}`;
    }
    if (index !== null) {
      newboneName += `.${index}`;
    }
    return newboneName;
  }

  addErrorContainer(lang: string, index = null): SlDetails {
    const errorContainer: SlAlert = document.createElement("sl-alert");
    errorContainer.dataset.name = `${this.generateboneName(lang, index)}_errorcontainer`;
    errorContainer.style.display = "none";
    const icon: SlIcon = document.createElement("sl-icon");
    icon.setAttribute("name", "exclamation-triangle");
    icon.setAttribute("slot", "icon");
    errorContainer.appendChild(icon);
    const errordiv: HTMLDivElement = document.createElement("div");
    errordiv.classList.add("error-msg");
    errorContainer.appendChild(errordiv);
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
      for (const _input: Array<HTMLElement, Array<number, number>> of this.inputsAbsolutePostions) {

        const elemRect: DOMRect = _input[0].getBoundingClientRect();
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
        console.log(this.swapElements)
        if (this.swapElements[0] !== null && this.swapElements[1] !== null) {
          const obj = this.reWriteBoneValue();
          const _value: BoneValue = getPath(obj, this.swapElements[0]);

          createPath(obj, this.swapElements[0], null, true,);
          createPath(obj, this.swapElements[1], _value, false, true);

          this.mainInstance.internboneValue = obj;
          this.mainInstance.handleChange();

          const multipleWrapper = this.mainInstance.bone.querySelector(`[data-multiplebone='${this.movePath}']`);
          if (multipleWrapper !== null) {
            const element = this.createMultipleWrapper(getPath(obj, this.movePath), this.moveLang)[0]
            multipleWrapper.replaceWith(element);
            this.absolutePostionSet = false;

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
          this.moveElement.style.top = `${(e.pageY - (this.startHeight / 2) - this.mainInstance.getBoundingClientRect().top).toString()}px`;//in of table
        } else {
          this.moveElement.style.top = `${(e.pageY - (this.startHeight / 2)).toString()}px`;//out of table
        }

        //this.moveElement.style.top = yPos  + "px";
        const y = e.clientY;

        for (const absolutePostions: Array<HTMLElement, number[]> of this.inputsAbsolutePostions) {
          const tmpElement: HTMLElement = absolutePostions[0];
          const tmpPos: number[] = absolutePostions[1];

          if (y > tmpPos[0])//top
          {
            if (y < tmpPos[1])//bottom
            {
              if (this.moveElementSrc === tmpElement) {
                break;
              }
              if (y - tmpPos[0] < (tmpPos[1] - tmpPos[0]) / 2) {
                if (elemetBefor !== tmpElement) {
                  elemetBefor = tmpElement;
                  const parent = tmpElement.parentElement;
                  if (parent) {
                    this.fakeElement.remove();
                    parent.insertBefore(this.fakeElement, tmpElement);
                    this.swapElements[1] = tmpElement.dataset.boneName;

                  }
                }
              } else {
                if (elemetAfter !== tmpPos[0]) {
                  elemetAfter = tmpPos[0];
                  this.fakeElement.remove();
                  tmpElement.after(this.fakeElement);
                  this.swapElements[1] = tmpElement.dataset.boneName;
                }

              }
              break;
            }
          }
        }
      }
    })
  }

  reWriteBoneValue(): Record<string, BoneValue> {
    const obj = {};

    this.mainInstance.bone.querySelectorAll("sl-input,sl-select").forEach((inputElement: SlInput | SlSelect) => {
      if (inputElement.name !== undefined && inputElement.value !== undefined && !inputElement.disabled) {
         console.log(inputElement,inputElement.name,inputElement.value,inputElement.disabled)
        createPath(obj, inputElement.name, inputElement.value);
      }

    });


    this.mainInstance.bone.querySelectorAll("sl-switch").forEach((inputElement: SlSwitch) => {
      if (inputElement.name !== undefined) {
        createPath(obj, inputElement.name, inputElement.checked);
      }

    });
    this.mainInstance.bone.querySelectorAll("sl-color-picker").forEach((inputElement: SlColorPicker) => {
      if (inputElement.name !== undefined) {

        createPath(obj, inputElement.name, inputElement.getFormattedValue("hex"));
      }

    });
    this.mainInstance.bone.querySelectorAll(`[data-textbone="true"]`).forEach((inputElement: HTMLElement) => {

      if (inputElement.dataset["name"] !== undefined) {

        createPath(obj, inputElement.dataset["name"], this.mainInstance.textboneCache[inputElement.dataset["name"]].getContent());
      }

    });
    this.mainInstance.bone.querySelectorAll(`[data-jsonbone="true"]`).forEach((inputElement: HTMLElement) => {

      if (inputElement.dataset["name"] !== undefined) {

        createPath(obj, inputElement.dataset["name"], this.mainInstance.jsonboneCache[inputElement.dataset["name"]]);
      }

    });

    return obj;
  }

  saveState(lang: string | null = null) {
    const path = lang === null ? this.boneName : `${this.boneName}.${lang}`;
    if (this.mainInstance.previousBoneValues[path] === undefined) {
      this.mainInstance.previousBoneValues[path] = []
    }
    const obj = this.reWriteBoneValue();
    this.mainInstance.previousBoneValues[path].push(getPath(obj, path));

  }

  undo(lang: string | null = null) {
    const path = lang === null ? this.boneName : `${this.boneName}.${lang}`;
    const multipleWrapper = this.mainInstance.bone.querySelector(`[data-multiplebone='${path}']`);

    const previousBoneValue: any = this.mainInstance.previousBoneValues[path].pop();
    const [element, idx] = this.createMultipleWrapper(previousBoneValue, lang);
    multipleWrapper.replaceWith(element);
    this.mainInstance.internboneValue = this.reWriteBoneValue();
    const undoButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='undoBtn.${path}']`);
    if (this.mainInstance.previousBoneValues[path].length === 0) {
      undoButton.style.display = "none";
    }
    if (lang !== null) {
      if (this.idx === null) {
        this.idx = {};
      }
      this.idx[lang] = idx;
    } else {
      this.idx = idx;
    }
    if (idx > 0) {
      const clearButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='clearBtn.${path}']`);
      clearButton.style.display = "";
      const placeholder: SlInput = this.mainInstance.bone.querySelector(`[data-name='placeholder.${path}']`);
      placeholder.style.display = "none";
    }


  }

  clearMultipleWrapper(lang: string | null = null) {
    const path = lang === null ? this.boneName : `${this.boneName}.${lang}`
    const multipleWrapper = this.mainInstance.bone.querySelector(`[data-multiplebone='${path}']`);
    this.saveState(lang);
    multipleWrapper.innerHTML = "";//Clear Wrapper;


    const undoButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='undoBtn.${path}']`);
    const clearButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='clearBtn.${path}']`);
    const placeholder: SlInput = this.mainInstance.bone.querySelector(`[data-name='placeholder.${path}']`);
    this.mainInstance.internboneValue = {[this.boneName]: [""]};// set the bone value to emtpy sting to delete it in the backend

    undoButton.style.display = "";
    clearButton.style.display = "none";
    placeholder.style.display = "";
    if (lang === null) {
      this.idx = 0;
    } else {
      this.idx[lang] = 0;
    }


  }

  getaddButton(lang: string | null = null) {
    const addButton = document.createElement("sl-button");
    const addIcon = document.createElement("sl-icon");

    addIcon.setAttribute("name", "plus");
    addIcon.setAttribute("slot", "prefix");
    addButton.appendChild(addIcon);
    addButton.innerHTML += translate("actions.add");
    addButton.setAttribute("variant", "success");
    addButton.setAttribute("outline", "");
    addButton.classList.add("add-button");
    addButton.variant = "success";
    addButton.title = translate("actions.add");
    addButton.disabled = this.boneStructure["readonly"];
    const name = lang === null ? `${this.boneName}` : `${this.boneName}.${lang}`;
    addButton.addEventListener("click", () => {
      const multipleWrapper = this.mainInstance.bone.querySelector(`[data-multiplebone='${name}']`);
      if (lang !== null) {
        multipleWrapper.appendChild(this.addInput(this.boneStructure["emptyvalue"], lang, this.idx[lang]));
        multipleWrapper.appendChild(this.addErrorContainer(lang, this.idx[lang]));
        this.idx[lang] += 1;
      } else {
        multipleWrapper.appendChild(this.addInput(this.boneStructure["emptyvalue"], null, this.idx));
        multipleWrapper.appendChild(this.addErrorContainer(null, this.idx));
        this.idx += 1;
      }

      const clearButton: SlButton = this.mainInstance.bone.querySelector(`[data-name='clearBtn.${name}']`);
      clearButton.style.display = "";
      const placeholder: SlInput = this.mainInstance.bone.querySelector(`[data-name='placeholder.${name}']`);
      placeholder.style.display = "none";

    });
    return addButton
  }

  getclearButton(lang: string | null = null) {

    const clearButton = document.createElement("sl-button");

    clearButton.addEventListener("click", () => {
      this.clearMultipleWrapper(lang)
    });
    clearButton.id = "clearButton"
    clearButton.classList.add("clear-button");
    clearButton.variant = "danger";
    clearButton.setAttribute("outline", "");
    const xicon: SlIcon = document.createElement("sl-icon");
    xicon.name = "x";
    xicon.slot = "suffix";
    clearButton.appendChild(xicon);
    clearButton.variant = "danger";
    clearButton.title = translate("actions.deleteAll");
    clearButton.dataset.name = lang === null ? `clearBtn.${this.boneName}` : `clearBtn.${this.boneName}.${lang}`;
    if (lang !== null) {

      if (this.idx[lang] === 0) {
        clearButton.style.display = "none"

      }
    } else {
      if (this.idx === 0) {
        clearButton.style.display = "none"

      }
    }
    return clearButton

  }

  getundoButton(lang: string | null = null) {
    const undoButton: SlButton = document.createElement("sl-button");
    const undoIcon: SlIcon = document.createElement("sl-icon");

    undoIcon.setAttribute("name", "arrow-counterclockwise");
    undoButton.appendChild(undoIcon);
    undoButton.setAttribute("outline", "");
    undoButton.classList.add("undo-button");
    undoButton.variant = "neutral";
    undoButton.title = translate("actions.undo");
    undoButton.addEventListener("click", () => {
      this.undo(lang)

    });
    undoButton.dataset.name = `undoBtn.${this.boneName}`
    undoButton.style.display = "none";
    return undoButton;
  }

  getplaceHolder(lang: string | null = null) {
    const placeholder = document.createElement("sl-input")
    placeholder.classList.add("multiple-placeholder");
    placeholder.setAttribute("filled", "");
    placeholder.setAttribute("placeholder", translate("actions.noentry"));
    placeholder.dataset.name = lang === null ? `placeholder.${this.boneName}` : `placeholder.${this.boneName}.${lang}`;
    if (lang !== null) {
      if (this.idx[lang] !== 0) {
        placeholder.style.display = "none";
      }
    } else {
      if (this.idx !== 0) {
        placeholder.style.display = "none";
      }
    }
    return placeholder;
  }

}
