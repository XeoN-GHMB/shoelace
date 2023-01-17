// @ts-nocheck
import {RawBone} from "./rawBone";
import SlInput from "../../input/input";
import {SlIcon} from "../../icon/icon";
import SlDetails from "../../details/details";
import {translate} from "../utils";

export class PasswordBone extends RawBone {
  private vaildIcon: any;
  private first_passwordBone: any;
  private second_passwordBone: any;

  getEditor(value: string | null, boneName: string, lang: string | null = null): HTMLElement {


    this.first_passwordBone = this.getPasswordInput(value, boneName);
    this.second_passwordBone = this.getPasswordInput(value, boneName);
    const container = document.createElement("div");

    container.appendChild(this.first_passwordBone);
    container.appendChild(this.second_passwordBone);
    return container;

  }

  getPasswordInput(value: string, boneName: string) {
    const inputElement: SlInput = document.createElement("sl-input");
    const validIcon: SlIcon = document.createElement("sl-icon");
    validIcon.slot = "suffix";
    validIcon.name = "x";
    inputElement.appendChild(validIcon);

    inputElement.dataset.boneName = boneName;
    inputElement.name = boneName;
    inputElement.type = "password";
    inputElement.setAttribute("password-toggle", true);


    if (this.boneStructure["readonly"] || this.mainInstance.disabled) {
      inputElement.disabled = true;
    }

    if (value === null || value === undefined) {
      inputElement.value = this.boneStructure["emptyValue"];
    } else {
      inputElement.value = value;
    }
    inputElement.addEventListener("sl-change", (change_event) => {
      if (this.first_passwordBone.value !== this.second_passwordBone.value) {
        if (this.first_passwordBone.value.length > 0) {
          if (this.second_passwordBone.value.length > 0) {
            //this.first_passwordBone.value.setCustomValidity("Please Fill");
            const element: SlDetails = this.mainInstance.bone.querySelector(`[data-name="${boneName}_errorcontainer"]`);
            if (element !== null) {
              element.style.display = "";
              element.open = true;
              element.querySelector(".error-msg").innerText += translate("error.password");
            }

          }
        }
      } else {
        this.mainInstance.internboneValue = this.reWriteBoneValue();
        this.mainInstance.handleChange();
        const element: SlDetails = this.mainInstance.bone.querySelector(`[data-name="${boneName}_errorcontainer"]`);
        if (element !== null) {
          element.style.display = "none";

        }
      }


    });

    inputElement.addEventListener("keyup", (keyup_event) => {

      if (this.first_passwordBone.value === this.second_passwordBone.value) {
        this.first_passwordBone.querySelector("sl-icon").name = "check";
        this.second_passwordBone.querySelector("sl-icon").name = "check";

      } else {
        this.first_passwordBone.querySelector("sl-icon").name = "x";
        this.second_passwordBone.querySelector("sl-icon").name = "x";

      }


    })

    return inputElement;

  }
}
