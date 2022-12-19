import {Tabulator, MoveRowsModule, Helpers, RowComponent} from './tabulator_esm.js';
import table from "../../react/table";

class CustomMoveRowsModule extends MoveRowsModule {
  constructor(table: Tabulator) {
    super(table);
    this.tableInstance=table;
    this.hoverRow = false
  }

  initializeRow(row: RowComponent) {
     if(!this.tableInstance.options["dataTree"])  //If we not have a datatree we only call the main function
    {
      super.initializeRow(row)
      return
    }


    super.initializeRow(row)
    var self = this,
      config = {},
      rowEl;

    //inter table drag drop
    config.mouseup = function (e) {
      self.tableRowDrop(e, row);
    }.bind(self);

    //same table drag drop
    config.mousemove = function (e) {
      var rowEl = row.getElement();
      this.hoverRow = row;
    }.bind(self);


    if (!this.hasHandle) {

      rowEl = row.getElement();

      rowEl.addEventListener("mousedown", function (e) {
        if (e.which === 1) {
          self.checkTimeout = setTimeout(function () {
            self.startMove(e, row);
          }, self.checkPeriod);
        }
      });

      rowEl.addEventListener("mouseup", function (e) {
        if (e.which === 1) {
          if (self.checkTimeout) {
            clearTimeout(self.checkTimeout);
          }
        }
      });

      this.bindTouchEvents(row, row.getElement());
    }

    row.modules.moveRow = config;
  }

  endMove(e) {
    if(!this.tableInstance.options["dataTree"])  //If we not have a datatree we only call the main function
    {
      super.endMove(e)
      return
    }
    if (!e || e.which === 1 || this.touchMove) {
      this._unbindMouseMove();

      if (!this.connection) {
        this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
        this.placeholderElement.parentNode.removeChild(this.placeholderElement);
      }

      this.hoverElement.parentNode.removeChild(this.hoverElement);

      this.table.element.classList.remove("tabulator-block-select");
      const hoverRowComponent: RowComponent = this.hoverRow.getComponent();
      const movingRowComponent: RowComponent = this.moving.getComponent();
      hoverRowComponent._row.data["_children"] = [];
      hoverRowComponent.addTreeChild(this.moving.getData())
      if (movingRowComponent.getTreeParent()) {

        const idx = movingRowComponent.getTreeParent().getData()["_children"].indexOf(this.moving.getData());
        movingRowComponent.getTreeParent().getData()["_children"].splice(idx, 1)
      }
      this.moving.table.rowManager.deleteRow(this.moving);


      this.moving = false;
      this.toRow = false;
      this.toRowAfter = false;

      document.body.removeEventListener("mousemove", this.moveHover);
      document.body.removeEventListener("mouseup", this.endMove);
      this.dispatchExternal("rowMovedDataTree", {"srcRow":movingRowComponent,"destRow":hoverRowComponent});

    }
  }
}

CustomMoveRowsModule.moduleName = "moveRow";
export {CustomMoveRowsModule};
