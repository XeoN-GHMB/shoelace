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

      if (this.first_passwordBone.value.length > 0) {
        if (this.second_passwordBone.value.length > 0) {
          const element: SlDetails = this.mainInstance.bone.querySelector(`[data-name="${boneName}_errorcontainer"]`);
          let hasError = false;
          if (element !== null) {
            element.querySelector(".error-msg").innerText=""
          }
          if (this.first_passwordBone.value !== this.second_passwordBone.value) {
            //this.first_passwordBone.value.setCustomValidity("Please Fill");

            if (element !== null) {
              element.style.display = "";
              element.open = true;
              element.querySelector(".error-msg").innerText += translate({path: "error.password.notMatch"});
            }
            hasError = true;

          }
          const errorMessages = this.testPassword(this.first_passwordBone.value)
          if (errorMessages.length) {
            hasError = true;
            if (element !== null) {
              element.style.display = "";
              element.open = true;
              element.querySelector(".error-msg").innerText += errorMessages.join("\n");
            }
          } else {
            element.style.display = "none";
            element.open = false;
            element.querySelector(".error-msg").innerText = "";
          }
          if (!hasError) {

            this.mainInstance.internboneValue = this.reWriteBoneValue();
            this.mainInstance.handleChange();

            if (element !== null) {
              element.style.display = "none";

            }
          }
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

  testPassword(password
                 :
                 string
  ):
    string [] {
    let errorMessages = [];
    let passedTests = 0;
    if (this.boneStructure["min_password_length"] === undefined) { // for older core versions
      this.boneStructure["min_password_length"] = 8;
    }
    if (this.boneStructure["test_threshold"] === undefined) { // for older core versions
      this.boneStructure["test_threshold"] = 3;
    }
    if (this.boneStructure["contain_uppercase"] === undefined) { // for older core versions
      this.boneStructure["contain_uppercase"] = `(?=.*[A-Z])`;
    }
    if (this.boneStructure["contain_lowercase"] === undefined) { // for older core versions
      this.boneStructure["contain_lowercase"] = `(?=.*[a-z])`;
    }
    if (this.boneStructure["contain_number"] === undefined) { // for older core versions
      this.boneStructure["contain_number"] = `(?=.*\d)`;
    }
    if (this.boneStructure["contain_special_char"] === undefined) { // for older core versions
      this.boneStructure["contain_special_char"] = `(?=.*\W)`;
    }


    if (this.boneStructure["contain_uppercase"] && !new RegExp(this.boneStructure["contain_uppercase"]).test(password)) {
      errorMessages.push(translate("error.password.no_uppercase"));
    } else {
      passedTests += 1;
    }
    if (this.boneStructure["contain_lowercase"] && !new RegExp(this.boneStructure["contain_lowercase"]).test(password)) {
      errorMessages.push(translate("error.password.no_lowercase"));

    } else {
      passedTests += 1;
    }

    if (this.boneStructure["contain_number"] && !new RegExp(this.boneStructure["contain_number"]).test(password)) {
      errorMessages.push(translate("error.password.no_numbers"))
    } else {
      passedTests += 1;
    }
    if (this.boneStructure["contain_special_char"] && !new RegExp(this.boneStructure["contain_special_char"]).test(password)) {
      errorMessages.push(translate("error.password.no_special_chars"))
    } else {
      passedTests += 1;
    }
    if (this.boneStructure["min_password_length"] > password.length) {

      if (passedTests >= this.boneStructure["test_threshold"]) { // the passwort is only to short
        errorMessages = [];
      }
      passedTests = 0; // we rest the passed test because passwort i to shore
      errorMessages.push(translate("error.password.toShort", {values: {"amount": this.boneStructure["min_password_length"]}}))
    }

    if (passedTests < this.boneStructure["test_threshold"]) {
      return errorMessages
    } else {
      return []
    }

  }
}
