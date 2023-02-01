// @ts-nocheck
import {EditModule} from "../tabulator_esm";

class CustomEditModule extends EditModule {
//return a formatted value for a cell
  bindEditor(cell) {
    if (cell.column.modules.edit) {

      var self = this,
        element = cell.getElement(true);

      this.updateCellClass(cell);
      element.setAttribute("tabindex", 0);

      element.addEventListener("click", function (e) {
        if (!element.classList.contains("tabulator-editing")) {


          if (!self.recursionBlock) {
            self.edit(cell, e, false);
          }
          element.focus({preventScroll: true});
        }
      });

      element.addEventListener("mousedown", function (e) {
        if (e.button === 2) {
          e.preventDefault();
        } else {
          self.mouseClick = true;
        }
      });

      element.addEventListener("focus", function (e) {

        if (!self.recursionBlock) {
          self.edit(cell, e, false);
        }
      });
    }
  }
}

export {CustomEditModule}
