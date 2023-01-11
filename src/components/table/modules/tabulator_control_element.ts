import {DataTreeModule} from "../tabulator_esm";

class CustomControllElements extends DataTreeModule {
  generateControlElement(row, el) {

    var config = row.modules.dataTree,
      oldControl = config.controlEl;

    el = el || row.getCells()[0].getElement();
    console.log("create CustomControllElements", config.children)
    if (config.children !== false) {

      if (config.open) {
        config.controlEl = this.collapseEl.cloneNode(true);
        config.controlEl.addEventListener("click", (e) => {
          e.stopPropagation();
          this.collapseRow(row);
        });
      } else {
        config.controlEl = this.expandEl.cloneNode(true);
        config.controlEl.addEventListener("click", (e) => {
          e.stopPropagation();
          this.expandRow(row);
        });
      }

      config.controlEl.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });

      if (oldControl && oldControl.parentNode === el) {
        oldControl.parentNode.replaceChild(config.controlEl, oldControl);
      } else {
        el.insertBefore(config.controlEl, el.firstChild);
      }
    } else {
      config.controlEl = this.expandEl.cloneNode(true);
      config.controlEl.classList.add("tabulator-control-element");
      config.controlEl.classList.add("control-element-disabled");
      if (oldControl && oldControl.parentNode === el) {
        oldControl.parentNode.replaceChild(config.controlEl, oldControl);
      } else {
        el.insertBefore(config.controlEl, el.firstChild);
      }
    }

  }
}

export {CustomControllElements}
