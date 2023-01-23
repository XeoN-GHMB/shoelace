import {Tabulator, MoveRowsModule, RowComponent, Row} from '../tabulator_esm.js';


class CustomMoveRowsModule extends MoveRowsModule {
  constructor(table: Tabulator) {
    super(table);
    this.tableInstance = table;
    this.hoverRow = false;
    this.addAsChild = false;
    this.timeOutId = null;
  }

  startMove(e, row: Row) {
    console.log("has childs", row.getComponent().getTreeChildren().length)
    if (row.getComponent().getTreeChildren().length > 0 && row.getComponent().isTreeExpanded()) {
      console.log("treeCollapse")
      row.getComponent().treeCollapse();
    }
    var element = row.getElement();

    this.setStartPosition(e, row);

    this.moving = row;

    this.table.element.classList.add("tabulator-block-select");

    //create placeholder
    this.placeholderElement.style.width = row.getWidth() + "px";


    element.parentNode.insertBefore(this.placeholderElement, element);


    //create hover element
    this.hoverElement = element.cloneNode(true);
    this.hoverElement.classList.add("tabulator-moving");

    element.classList.add("tabulator-row-disabled")
    element.dataset.disabled = "true";

    this.table.rowManager.getTableElement().appendChild(this.hoverElement);

    this.hoverElement.style.left = "0";
    this.hoverElement.style.top = "0";
    // this.hoverElement.style.height = "50px";
    this.hoverElement.style.opacity = "0.5";

    this._bindMouseMove();


    document.body.addEventListener("mousemove", this.moveHover);
    document.body.addEventListener("mouseup", this.endMove);

    this.dispatchExternal("rowMoving", row.getComponent());

    this.moveHover(e);
    //overwrite placeholder


  }

  initializeRow(row: RowComponent) {
    super.initializeRow(row)
    if (!this.tableInstance.options["dataTree"])  //If we not have a datatree we only call the main function
    {

      return
    }
    var self = this,
      config = {},
      rowEl;

    //same table drag drop
    config.mousemove = function (e) {

      rowEl = row.getElement();

      if (row !== self.hoverRow) {

        //row.getComponent().select();
        if (self.hoverRow) {
          self.hoverRow.getComponent().deselect();
        }
        /*//maybe later
        if (self.timeOutId !== null) {
          clearTimeout(self.timeOutId)
        }

        self.timeOutId = setTimeout(() => {

          if (!self.hoverRow.getComponent().isTreeExpanded() && self.hoverRow !== self.moving) {
            self.hoverRow.getComponent().treeExpand();
            const tmp_Y = self.startY;
            self.startMove(e, self.moving);
            self.startY = tmp_Y;
          }

        }, 1500)
    */

      }

      self.hoverRow = row;
      if (((e.pageY - Helpers.elOffset(rowEl).top) + self.table.rowManager.element.scrollTop) > (row.getHeight() / 2)) {
        if (self.toRow !== row || !self.toRowAfter) {
          rowEl.parentNode.insertBefore(self.placeholderElement, rowEl.nextSibling);
          self.moveRow(row, true);
        }
      } else {
        if (self.toRow !== row || self.toRowAfter) {
          rowEl.parentNode.insertBefore(self.placeholderElement, rowEl);
          self.moveRow(row, false);
        }
      }
    }.bind(self);
    row.modules.moveRow = config;
  }

  createPlaceholderElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-col");
    el.classList.add("tabulator-col-placeholder");

    return el;
  }

  moveHover(e) {
    super.moveHover(e);
    if (!this.hoverRow) {
      return
    }
    const rowHeight = this.hoverRow.getElement().clientHeight;
    const inRowY = (e.pageY - Helpers.elOffset(this.hoverRow.getElement()).top);
    const minYChild = rowHeight / 5;
    const maxYChild = rowHeight / 5 * 4;
    const sameParent = this.hoverRow.getComponent().getData()["parententry"] === this.moving.getComponent().getData()["parententry"];
    if (inRowY > minYChild && inRowY < maxYChild) {
      this.addAsChild = true;
      if (this.hoverRow.getElement().dataset.disabled !== "true") {
        this.hoverRow.getComponent().select();
      }

      this.placeholderElement.style.height = "0px";
    } else {
      this.addAsChild = false;
      this.placeholderElement.style.height = "10px";

      this.hoverRow.getComponent().deselect();
    }
    //if(inRowY )
    //((e.pageY - Helpers.elOffset(rowEl).top) + self.table.rowManager.element.scrollTop) > (row.getHeight() / 2)

  }


  endMove(e) {

    console.log("try to end moving")

    if (!this.tableInstance.options["dataTree"])  //If we not have a datatree we only call the main function
    {
      super.endMove(e)
      return
    }


    if (this.hoverRow) {
      //this.hoverRow.getElement().style.borderWidth = "0px";
      const self = this;
      //reset movingelement
      this.moving.getElement().classList.remove("tabulator-row-disabled")
      this.moving.getElement().dataset.disabled = "";
      const hoverRowComponent: RowComponent = this.hoverRow.getComponent();
      const movingRowComponent: RowComponent = this.moving.getComponent();
      if (hoverRowComponent === movingRowComponent) {
        this.placeholderElement.parentNode.removeChild(this.placeholderElement);
        this._endMove(e)
        return;
      }
      if (this.addAsChild) {
        /**
         * >1 moving
         * >2
         * >3 hover
         * =======
         * >2
         * >3
         *  >1 (child)
         */
        if (!hoverRowComponent._row.data.hasOwnProperty("_children")) {
          hoverRowComponent._row.data["_children"] = []
        }
        if (hoverRowComponent._row.data["_children"][0] === undefined) {
          hoverRowComponent._row.data["_children"] = [];
        }
        console.log(`update parent entry form ${movingRowComponent.getData()["parententry"]} to ${hoverRowComponent.getData()["key"]}`)
        const updateData = {};
        updateData["parententry"] = hoverRowComponent.getData()["key"];
        movingRowComponent.update(updateData).then(() => {
          console.log(`parent entry form ${movingRowComponent.getData()["parententry"]}`)
          this.moveRowToChild(hoverRowComponent, movingRowComponent);
          self.moving.delete();

          self.dispatchExternal("rowMovedDataTree", {
            "move": true,
            "sortindex": false,
            "srcKey": movingRowComponent.getData()["key"],
            "destKey": hoverRowComponent.getData()["key"]
          });
          self._endMove(e);
        });


      } else { //change sort index and move maybe
        console.log("moving name=", movingRowComponent.getData()["name"], movingRowComponent.getData())
        console.log("hover name=", hoverRowComponent.getData()["name"], hoverRowComponent.getData())
        console.log("same parent=", movingRowComponent.getData()["parententry"] === hoverRowComponent.getData()["parententry"])
        console.log("after =", this.toRowAfter)
        /*if the hover row is expanded and we want append after the row we must set  toRowAfter to  false and
                  *hoverRowComponent to the first child
                  *
                  *  */
        if (hoverRowComponent.isTreeExpanded() && this.toRowAfter && hoverRowComponent.getTreeChildren().length > 0) {
          this.toRowAfter = false;
          this.hoverRow = hoverRowComponent.getTreeChildren()[0]._getSelf();
          this.endMove(e);
          return;
        }
        if (movingRowComponent.getData()["parententry"] === hoverRowComponent.getData()["parententry"]) { // we move in the same parententry
          /** (after = true)
           * >1
           *  >2 moving
           *  >3 hover
           * =======
           * >1
           *  >3
           *  >2
           */



          const sortindex = this.calcSortIndex(hoverRowComponent, this.toRowAfter);
          this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
          this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
          this.placeholderElement.parentNode.removeChild(this.placeholderElement);

          movingRowComponent.update({"sortindex": sortindex}).then(() => {
            this.dispatchExternal("rowMovedDataTree", {
              "move": false,
              "sortindex": sortindex,
              "srcKey": movingRowComponent.getData()["key"]
            });

            this._endMove()
          })
          return;
        }


        if (movingRowComponent.getTreeParent()) { //moving is a child

          // we must move and set new sort index
          if (hoverRowComponent.getTreeParent()) {//move form child to child


            /** (after = true)
             * >1
             *  >2 moving
             * >3
             *  >4 hover
             *  >5
             * =======
             * >1
             * >3
             *  >4
             *  >2
             *  >5
             */


            const sortindex = this.calcSortIndex(hoverRowComponent, this.toRowAfter);
            this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
            const updateData = {};
            updateData["parententry"] = hoverRowComponent.getTreeParent().getData()["key"];
            this.moveRowToChild(hoverRowComponent.getTreeParent(), movingRowComponent, hoverRowComponent, this.toRowAfter)


            updateData["sortindex"] = sortindex;
            movingRowComponent.update(updateData).then(() => {


              this.dispatchExternal("rowMovedDataTree", {
                "move": true,
                "sortindex": sortindex,
                "srcKey": movingRowComponent.getData()["key"],
                "destKey": updateData["parententry"]
              });
              this._endMove(e);
            })
          } else {//we move form child to root
            /** (after = true)
             * >1
             *  >2 moving
             *  >3
             * >4 hover
             * =======
             *
             * >1
             *  >3
             * >4
             * >2
             */

            const updateData = {};
            const sortindex = this.calcSortIndex(hoverRowComponent, this.toRowAfter);
            updateData["parententry"] = hoverRowComponent.getData()["parententry"];
            updateData["sortindex"] = sortindex;
            movingRowComponent.update(updateData).then(() => {
              this.dispatchExternal("rowMovedDataTree", {
                "move": true,
                "sortindex": sortindex,
                "srcKey": movingRowComponent.getData()["key"],
                "destKey": updateData["parententry"]
              });
              console.log("move to root")
              self.moveRowToRoot(hoverRowComponent, movingRowComponent, self.toRowAfter)
              //self.moving.table.rowManager.deleteRow(self.moving);
              this._endMove(e);
            })
          }


        } else { // from root to child

          /** (after = false)
           * >1 moving
           * >2
           *  >3 hover
           * =======
           * >2
           *  >1
           *  >3
           */
          console.log("here ? =>1")

          const hoverRowComponentParent = hoverRowComponent.getTreeParent();
          const updateData = {};
          const sortindex = this.calcSortIndex(hoverRowComponent, this.toRowAfter)
          updateData["parententry"] = hoverRowComponentParent.getData()["key"];
          updateData["sortindex"] = sortindex;
          movingRowComponent.update(updateData).then(() => {
            this.dispatchExternal("rowMovedDataTree", {
              "move": true,
              "sortindex": sortindex,
              "srcKey": movingRowComponent.getData()["key"],
              "destKey": hoverRowComponentParent.getData()["key"]
            });
            self.moveRowToChild(hoverRowComponentParent, movingRowComponent, hoverRowComponent, self.toRowAfter);
            self.moving.delete();
            this._endMove(e)
          })


        }

      }

    }

  }


  _endMove(e) {
    if (!e || e.which === 1 || this.touchMove) {
      clearTimeout(this.timeOutId)
      this._unbindMouseMove();

      try {
        this.hoverElement.parentNode.removeChild(this.hoverElement);
      } catch (err) {
        console.error(err)
      }

      this.table.element.classList.remove("tabulator-block-select");


      this.moving = false;
      this.toRow = false;
      this.toRowAfter = false;

      document.body.removeEventListener("mousemove", this.moveHover);
      document.body.removeEventListener("mouseup", this.endMove);


    }

  }

  moveRowToChild(destRowComponent, srcRowComponent, childComponent = null, after = true) {
    /**
     * if childComponent is set we insert the srcRowComponent before or after it
     */
    console.log("movetochild")
    if (!destRowComponent._row.data.hasOwnProperty("_children")) {
      destRowComponent._row.data["_children"] = []
    }
    if (destRowComponent._row.data["_children"][0] === undefined) {
      destRowComponent._row.data["_children"] = [];
    }
    let idxChild = null;
    let idx = -1;
    if (childComponent) {
      destRowComponent.getTreeChildren().forEach((child, i) => {
        if (childComponent === child) {

          idxChild = child;
          idx = i;
          return;
        }
      })
    }
    if (idxChild !== null) { //We found the child
      console.log(idx === 0 && !after, idxChild)
      if (!after && idx > 0) {
        idxChild = destRowComponent.getTreeChildren()[idx - 1];
      }
      destRowComponent.addTreeChild(srcRowComponent.getData(), idx === 0 && !after, idxChild)
    } else {
      console.log("we add",srcRowComponent.getData()["name"],"to ",destRowComponent)
      destRowComponent.addTreeChild(srcRowComponent.getData());
      console.log("childs,",destRowComponent.getTreeChildren())
    }


    if (srcRowComponent.getTreeParent()) {
      srcRowComponent.delete();
      /*
      const idx = srcRowComponent.getTreeParent().getData()["_children"].indexOf(srcRowComponent.getData());
      srcRowComponent.getTreeParent().removeTreeChild(idx)*/

    }
  }

  moveRowToRoot(destRowComponent, srcRowComponent, after = true) {
    if (srcRowComponent.getTreeParent()) {
      srcRowComponent.delete();
      /*
      const idx = srcRowComponent.getTreeParent().getData()["_children"].indexOf(srcRowComponent.getData());
      srcRowComponent.getTreeParent().removeTreeChild(idx)*/
    }
    console.log(" srcRowComponent getTreeParent", srcRowComponent.getTreeParent())
    console.log("after", after)
    console.log("destrow", destRowComponent)
    console.log("getPosition", destRowComponent.getPosition())

    //WTF  the docu is completely wrong here (addData)
    if (!after && destRowComponent.getPosition() === 1) {
      this.tableInstance.addData(srcRowComponent.getData(), true);
    } else {
      if (after) {
        this.tableInstance.addData(srcRowComponent.getData(), undefined, destRowComponent);
      } else {
        this.tableInstance.addData(srcRowComponent.getData(), undefined, destRowComponent.getPrevRow());
      }

    }

  }

  calcSortIndex(destRow: RowComponent, after: boolean) {

    let nextRow = destRow.getNextRow();
    let prevRow = destRow.getPrevRow();
    console.log("next", nextRow)
    console.log("prevRow", prevRow)
    //check if nextrow is same level
    if (nextRow) {
      nextRow = nextRow.getData()["parententry"] === destRow.getData()["parententry"] ? nextRow : false;
    }
    if (prevRow) {
      prevRow = prevRow.getData()["parententry"] === destRow.getData()["parententry"] ? prevRow : false;
    }


    let newSortIndex;

    if (after) {
      if (nextRow) {
        newSortIndex = (nextRow.getData()["sortindex"] + destRow.getData()["sortindex"]) / 2.0
      } else {
        console.log("we have no nextRow we must calc +1")
        newSortIndex = destRow.getData()["sortindex"] + 1
      }
    } else {
      if (prevRow) {

        newSortIndex = (prevRow.getData()["sortindex"] + destRow.getData()["sortindex"]) / 2.0
      } else {
        console.log("we have no prevRow we must calc -1")
        newSortIndex = destRow.getData()["sortindex"] - 1
      }

    }
    if (newSortIndex === -1) {
      throw "Invaild sortindx"
    }
    return newSortIndex
  }
}

CustomMoveRowsModule.moduleName = "moveRow";
export {
  CustomMoveRowsModule
};

///Hard copy helper class
class Helpers {

  static elVisible(el) {
    return !(el.offsetWidth <= 0 && el.offsetHeight <= 0);
  }

  static elOffset(el) {
    var box = el.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }

  static deepClone(obj, clone, list = []) {
    var objectProto = {}.__proto__,
      arrayProto = [].__proto__;

    if (!clone) {
      clone = Object.assign(Array.isArray(obj) ? [] : {}, obj);
    }

    for (var i in obj) {
      let subject = obj[i],
        match, copy;

      if (subject != null && typeof subject === "object" && (subject.__proto__ === objectProto || subject.__proto__ === arrayProto)) {
        match = list.findIndex((item) => {
          return item.subject === subject;
        });

        if (match > -1) {
          clone[i] = list[match].copy;
        } else {
          copy = Object.assign(Array.isArray(subject) ? [] : {}, subject);

          list.unshift({subject, copy});

          clone[i] = this.deepClone(subject, copy, list);
        }
      }
    }

    return clone;
  }
}

