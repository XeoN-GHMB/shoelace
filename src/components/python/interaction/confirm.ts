import SlCard from "../../card/card";
export class Confirm {
  element;
  constructor(entry,pyInstance)
  {
    console.log("entry",entry)
    this.element = document.createElement("sl-card");
    //header
    const header = document.createElement("div");
    header.slot="header"
    header.innerText=entry.title;
    this.element.appendChild(header);
    //content
    const content = document.createElement("p");
    content.innerText=entry.text;
    this.element.appendChild(content);
    //Buttons
    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("container");
    buttonWrapper.slot="footer";

    const noButton = document.createElement("sl-button");
    noButton.size = "small";
    noButton.variant = "danger";
    noButton.innerText="No";
    noButton.addEventListener("click", () => {
      pyInstance.sendDialogResult("alert", 0).then(() => {
      })
    });
    buttonWrapper.appendChild(noButton);

     const cancelButton = document.createElement("sl-button");
    cancelButton.size = "small";
    cancelButton.variant = "neutral";
    cancelButton.innerText="cancle";
    cancelButton.addEventListener("click", () => {
      pyInstance.sendDialogResult("alert", -1).then(() => {
      })
    });
    buttonWrapper.appendChild(cancelButton);

     const yesButton = document.createElement("sl-button");
    yesButton.size = "small";
    yesButton.variant = "success";
    yesButton.innerText="Yes";
    yesButton.addEventListener("click", () => {
      pyInstance.sendDialogResult("alert", 1).then(() => {
      })
    });
    buttonWrapper.appendChild(yesButton);

this.element.appendChild(buttonWrapper);

  }
  getElement()
  {
    return this.element;
  }
}
