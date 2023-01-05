import {Tabulator, MoveRowsModule, RowComponent, Row} from '../tabulator_esm.js';


class CustomMoveRowsModule extends MoveRowsModule {
  constructor(table: Tabulator) {
    super(table);
    this.tableInstance = table;
    this.hoverRow = false;
    this.addAsChild = false;
  }

  startMove(e, row) {
    console.log("start mobve ? ")
    row.getComponent().treeCollapse();
    super.startMove(e, row)
    this.hoverElement.style.height = "50px";
    this.hoverElement.style.opacity = "0.5";

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
    el.style.backgroundColor = "blue"
    el.style.height = "10px"

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

    if (inRowY > minYChild && inRowY < maxYChild) {
      this.addAsChild = true;
      this.hoverRow.getComponent().select();
      this.placeholderElement.style.height = "0px";
    } else {
      this.addAsChild = false;
      this.placeholderElement.style.borderColor = "blue"
      this.placeholderElement.style.marginLeft = "0px";
      this.placeholderElement.style.height = "5px";
      this.placeholderElement.innerText = "";
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
      this.hoverRow.getElement().style.borderWidth = "0px";
      const self = this;
      const hoverRowComponent: RowComponent = this.hoverRow.getComponent();
      const movingRowComponent: RowComponent = this.moving.getComponent();
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
        if (hoverRowComponent._row.data["_children"][0] === undefined) {
          hoverRowComponent._row.data["_children"] = [];
        }
        console.log(`update parent entry form ${movingRowComponent.getData()["parententry"]} to ${hoverRowComponent.getData()["key"]}`)
        const tmp_data = movingRowComponent.getData();
        tmp_data["parententry"] = hoverRowComponent.getData()["key"];
        movingRowComponent.update(tmp_data).then(() => {
          console.log(`parent entry form ${movingRowComponent.getData()["parententry"]}`)
          this.moveRowToChild(hoverRowComponent, movingRowComponent)

          self.moving.table.rowManager.deleteRow(self.moving);
          self.dispatchExternal("rowMovedDataTree", {
            "move": true,
            "sortindex": false,
            "after": this.toRowAfter,
            "srcRow": movingRowComponent,
            "destRow": hoverRowComponent,
            "srcKey": movingRowComponent.getData()["key"],
            "destKey": hoverRowComponent.getData()["key"]
          });
          self._endMove(e);
        });


      } else { //change sort index and move maybe
        console.log("Move sort index")
        console.log("moving name=", movingRowComponent.getData()["name"], movingRowComponent.getData())
        console.log("hover name=", hoverRowComponent.getData()["name"], hoverRowComponent.getData())
        console.log("same parent=", movingRowComponent.getData()["parententry"] === hoverRowComponent.getData()["parententry"])
        console.log("after =", this.toRowAfter)


        if (movingRowComponent.getTreeParent()) {

          if (movingRowComponent.getData()["parententry"] === hoverRowComponent.getData()["parententry"]) {
            /** (after = true)
             * >1
             *  >2 moving
             *  >3 hover
             * =======
             * >1
             *  >3
             *  >2
             */
            console.log("We change only the sort index");
            const sortindex = this.calcSortIndex(hoverRowComponent, this.toRowAfter)
            movingRowComponent.update({"sortindex": sortindex}).then(() => {
              this.dispatchExternal("rowMovedDataTree", {
                "move": false,
                "sortindex": sortindex,
                "srcKey": movingRowComponent.getData()["key"]
              });
              this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
              this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
              this.placeholderElement.parentNode.removeChild(this.placeholderElement);
              this._endMove()
            })
          } else // we must move and set new sort index
          {
            //we must move
            console.log("we must move =>")
            if (hoverRowComponent.getTreeParent()) {//move form child to child
              /** (after = true)
               * >1
               *  >2 moving
               * >3
               *  >4 hover
               * =======
               * >1
               * >3
               *  >4
               *  >2
               */
              this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
              this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
              this.placeholderElement.parentNode.removeChild(this.placeholderElement);
              const tmp_data = movingRowComponent.getData();
              tmp_data["parententry"] = hoverRowComponent.getTreeParent().getData()["key"];
              movingRowComponent.update(tmp_data).then(() => {
                this.moveRowToChild(hoverRowComponent.getTreeParent(), movingRowComponent, hoverRowComponent, this.toRowAfter)
                this._endMove(e);
                this.dispatchExternal("rowMovedDataTree", {
                  "move": true,
                  "sortindex": this.calcSortIndex(hoverRowComponent, this.toRowAfter),
                  "srcKey": movingRowComponent.getData()["key"],
                  "destKey": hoverRowComponent.getData()["key"]
                });
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

              const tmp_data = movingRowComponent.getData();
              tmp_data["parententry"] = hoverRowComponent.getData()["parententry"];
              movingRowComponent.update(tmp_data).then(() => {
                this.dispatchExternal("rowMovedDataTree", {
                  "move": true,
                  "sortindex": this.calcSortIndex(hoverRowComponent, this.toRowAfter),
                  "srcKey": movingRowComponent.getData()["key"],
                  "destKey": hoverRowComponent.getData()["parententry"]
                });
                self.moveRowToRoot(hoverRowComponent, movingRowComponent, self.toRowAfter)
                self.moving.table.rowManager.deleteRow(self.moving);
                this._endMove(e);
              })
            }


          }
        } else { // from root to child or only a sortindex
          if (hoverRowComponent.getTreeParent()) { // hover is a child
            /** (after = false)
             * >1 moving
             * >2
             *  >3 hover
             * =======
             * >2
             *  >1
             *  >3
             */

            const hoverRowComponentParent = hoverRowComponent.getTreeParent();
            this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
            this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
            this.placeholderElement.parentNode.removeChild(this.placeholderElement);
            const tmp_data = movingRowComponent.getData();
            const sortindex = this.calcSortIndex(hoverRowComponent, this.toRowAfter)
            tmp_data["parententry"] = hoverRowComponentParent.getData()["key"];
            tmp_data["sortindex"] = sortindex;
            movingRowComponent.update(tmp_data).then(() => {
              this.dispatchExternal("rowMovedDataTree", {
                "move": true,
                "sortindex": sortindex,
                "srcKey": movingRowComponent.getData()["key"],
                "destKey": hoverRowComponentParent.getData()["key"]
              });
              self.moveRowToChild(hoverRowComponentParent, movingRowComponent, hoverRowComponent, self.toRowAfter)
              self.moving.table.rowManager.deleteRow(self.moving);
              this._endMove(e)
            })


          } else { //we move from root to root change only the sortindex
            /** (after = false)
             * >1 moving
             * >2
             * >3 hover
             * =======
             * >2
             * >1
             * >3
             */
            this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
            this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
            this.placeholderElement.parentNode.removeChild(this.placeholderElement);
            const sortindex = this.calcSortIndex(hoverRowComponent, this.toRowAfter)
            movingRowComponent.update({"sortindex": sortindex}).then(() => {
              this.dispatchExternal("rowMovedDataTree", {
                "move": false,
                "sortindex": sortindex,
                "srcKey": movingRowComponent.getData()["key"]
              });
            });
            this._endMove(e)
          }


        }

      }

    }

  }

  _endMove(e) {
    if (!e || e.which === 1 || this.touchMove) {
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
    console.log("movetochild")
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
    if (idxChild !== null) {
      console.log(idx === 0 && !after, idxChild)
      if (!after && idx > 0) {
        idxChild = destRowComponent.getTreeChildren()[idx - 1];
      }
      destRowComponent.addTreeChild(srcRowComponent.getData(), idx === 0 && !after, idxChild)
    } else {
      destRowComponent.addTreeChild(srcRowComponent.getData())
    }


    if (srcRowComponent.getTreeParent()) {
      const idx = srcRowComponent.getTreeParent().getData()["_children"].indexOf(srcRowComponent.getData());
      srcRowComponent.getTreeParent().removeTreeChild(idx)

    }
  }

  moveRowToRoot(destRowComponent, srcRowComponent, after = true) {
    if (srcRowComponent.getTreeParent()) {
      const idx = srcRowComponent.getTreeParent().getData()["_children"].indexOf(srcRowComponent.getData());
      srcRowComponent.getTreeParent().removeTreeChild(idx)
    }
    console.log("after", after)
    console.log("destrow", destRowComponent)

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

  calcSortIndex(destRow, after) {

    let nextRow = destRow.getNextRow();
    let prevRow = destRow.getPrevRow();
    if (after) {
      if (nextRow)// we have the src row
      {
        nextRow = nextRow.getNextRow();
      }
    } else {
      if (prevRow)// we have the src row
      {
        prevRow = prevRow.getPrevRow();
      }
    }


    let newSortIndex;

    if (after) {
      if (nextRow) {
        newSortIndex = (nextRow.getData()["sortindex"] + destRow.getData()["sortindex"]) / 2.0
      } else {
        newSortIndex = destRow.getData()["sortindex"] + 1
      }
    } else {
      if (prevRow) {

        newSortIndex = (prevRow.getData()["sortindex"] + destRow.getData()["sortindex"]) / 2.0
      } else {
        console.log("at end")
        newSortIndex = destRow.getData()["sortindex"] - 1
      }

    }
    if (newSortIndex === -1) {
      throw "Invaild sortindx"
    }
    return newSortIndex
  }
}

CustomMoveRowsModule
  .moduleName = "moveRow";
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

