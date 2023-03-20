// @ts-nocheck

import {html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import ShoelaceElement from '../../internal/shoelace-element';
import {watchProps} from '../../internal/watchProps';

import styles from './table.styles';
import {boneFormatter} from "./cellRenderer.ts";
import {boneEditor, updateData} from "./cellEditorRenderer.ts";
//@ts-ignore
import {TabulatorFull, RowComponent} from './tabulator_esm.js';
import {CustomMoveRowsModule} from './modules/tabulator_move_rows';
import {CustomReactiveDataModule} from "./modules/tabulator_removeTreeChildRow";
import {CustomControllElements} from "./modules/tabulator_control_element";
import {CustomEditModule} from "./modules/tabulator_edit";
import option from "../../react/option";


/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @event sl-selectionChanged - Emits selection change event
 *
 * @slot - Place a Table
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --table-head-background - Table head background
 * @cssproperty --table-head-color - Table head textcolor
 * @cssproperty --table-head-background-hover - Table head background on hover
 * @cssproperty --table-head-color-hover - Table head textcolor on hover
 * @cssproperty --table-row-color-even - even row background color
 * @cssproperty --table-row-color-hover - row hover color
 */
@customElement('sl-table')
export default class SlTable extends ShoelaceElement {
  static styles = styles;

  @query('#shadowtable') shadowtable: HTMLInputElement;

  /** placeholder string for empty tables */
  @property({type: String, reflect: true}) placeholder: String = "No Data Available";

  /** set table height */
  @property({type: String, reflect: true}) height: String = "auto";

  /** set table min-height */
  @property({type: String, reflect: true}) minheight: String = "auto";

  /** set initial sorting */
  @property({type: String, reflect: true}) sort: any = null;

  /** set search string to execute filter */
  @property({type: String, reflect: true}) search: String = '';

  /** are columns moveable?*/
  @property({type: Boolean, reflect: true}) moveablecolumns: Boolean = false;

  /** are columns moveable?*/
  @property({type: Boolean, reflect: true}) external: Boolean = false;

  /** are rows moveable?*/
  @property({type: Boolean, reflect: true}) moveablerows: Boolean = false;

  /** are rows have a index ?*/
  @property({type: Boolean, reflect: true}) rowindexes: Boolean = false;

  /** are rows selectable?*/
  @property({type: Boolean | Number, reflect: true}) rowselect: Boolean | Number = false;

  /** disable columnselection menu?*/
  @property({type: Boolean, reflect: true}) nocolumnsmenu: Boolean = false;

  /** set skellist as tabledata ?*/
  @property({type: Array, attribute: false}) skellist: Object;

  /** set a structure to generate table head */
  @property({type: Object, attribute: false}) structure: Object;

  /** Override table config Object */
  @property({type: Object, attribute: false}) tableConfig: Object = {
    layout:"fitColumns",
    reactiveData: true,
    popupContainer: true
  };
  /** set a module for requests to the server */
  @property({type: String, attribute: false}) module: String = null;

  /** disable editable Table*/
  @property({type: Boolean, attribute: false}) editabletable: Boolean = false;

  @property({type: String, attribute: false}) mode: String = "list";

  @property({type: Object | Boolean, attribute: false}) customColumns = false

  //hierarchy part
  @property({type: Object, attribute: false}) nodes: Object;
  @property({type: Boolean, attribute: false}) inVi = false;


  tableInstance: any;
  tableReady: Boolean = false;
  inScrollEvent: Boolean = false;
  previousStructure: any = null;
  _editabletable: boolean = this.editabletable;
  expandDepth = 0;
  visibleColumns = [];


  @watchProps(['structure', 'skellist', "editabletable", "nodes", "mode", "customColumns"])
  optionUpdate() {
    //only rebuild table if structure changed
    if (this.mode === "list") {
      if (this.skellist === undefined || this.structure === undefined || Object.keys(this.structure).length === 0) {
        return;
      }
    } else if (this.mode === "hierarchy") {
      if (this.nodes === undefined || this.structure === undefined || Object.keys(this.structure).length === 0) {
        return;
      }
    }

    this._editabletable = this.editabletable;
    if (this.previousStructure !== this.structure || this.customColumns) {
      this.previousStructure = this.structure

      this.buildStructure();
      this.updateConfig();
      if (!this.shadowtable) {
        return 0
      }

      TabulatorFull.registerModule(CustomMoveRowsModule);
      TabulatorFull.registerModule(CustomReactiveDataModule);
      TabulatorFull.registerModule(CustomControllElements);
      TabulatorFull.registerModule(CustomEditModule);


      //TabulatorFull.registerModule(CustomCell);
      this.tableInstance = new TabulatorFull(this.shadowtable, this.tableConfig)

      this.tableInstance.on("tableBuilt", () => {
        this.postBuildTable()
        if (this.mode === "list") {
          console.log("set data len=",this.skellist.length)

          this.tableInstance.setData(this.skellist)
        } else if (this.mode === "hierarchy") {
          this.tableInstance.setData(this.nodes)
        }
        this.tableReady = true
      })

      if (this.moveablerows) {
        if (this.mode === "list") {
          this.tableInstance.on("rowMoved", (row) => {

            const nextRow = row.getNextRow();
            const prevRow = row.getPrevRow();
            let newSortIndex = 0;
            if (nextRow) {
              if (prevRow) {
                newSortIndex = (nextRow.getData()["sortindex"] + prevRow.getData()["sortindex"]) / 2.0
              } else {
                newSortIndex = nextRow.getData()["sortindex"] - 1;
              }
            } else {
              if (prevRow) {
                newSortIndex = prevRow.getData()["sortindex"] + 1;
              } else {
                return;
              }

            }

            const formData = new FormData();
            formData.set("sortindex", newSortIndex);
            updateData(formData, row.getData()["key"], this)


          })
        }
        if (this.mode === "hierarchy") {
          const self = this;
          this.tableInstance.on("rowMovedDataTree", (detail) => {


            if (detail.move && !detail.sortindex) {
              self.emit("table-rowMovedDataTree", {"detail": detail});

            } else if (!detail.move && detail.sortindex) {

              self.emit("table-newSortIndex", {"detail": detail});


            } else if (detail.move && detail.sortindex) {
              self.emit("table-move_and_SortIndex", {"detail": detail});
            }


          });

        }

      }
      if (this.mode === "hierarchy") {

        const self = this;//keep the instance hack
        this.tableInstance.on("dataTreeRowExpanded", function (row, level: number) {//we must fetch new data
          self.expandDepth = Math.max(self.expandDepth, level);


          if (row._row.data["_children"][0] === undefined) {//we not trigger the event when we already have data
            row._row.data["_children"] = [];
          }
          self.emit("table-fetchNodes", {detail: {"key": row.getData().key, "level": level, "row": row}});

        });
        this.tableInstance.on("dataTreeRowCollapsed", (row, level: number) => {

          self.expandDepth = Math.min(self.expandDepth, level);

        })

      }

    }
    //update Data only if tableReady
    if (this.tableReady || this.inScrollEvent) {

      this.inScrollEvent= false;
      if (this.mode === "list") {
        console.log("set data len=",this.skellist.length)
        this.tableInstance.replaceData(this.skellist)
      } else if (this.mode === "hierarchy") {
        this.tableInstance.replaceData(this.nodes)
      }


    }
    return 1
  }

  addData(data) {

    if (!this.tableInstance) {
      return 0;
    }
    if (this.tableReady) {
      this.tableInstance.updateOrAddData(data)

    }
  }

  getSelectedRows() {
    if (!this.tableInstance) {
      return 0;
    }
    return this.tableInstance.getSelectedRows()
  }

  @watchProps(['search'])
  performFilter() {
    function matchAny(data: any, filterParams: any) {
      //data - the data for the row being filtered
      //filterParams - params object passed to the filter
      //RegExp - modifier "i" - case insensitve

      var match = false;
      const regex = RegExp(filterParams.value, 'i');

      for (var key in data) {
        if (regex.test(data[key]) == true) {
          match = true;
        }
      }
      return match;
    }

    if (!this.tableInstance) {
      return 0
    }
    if (!this.search || this.search === '') {
      this.tableInstance.clearFilter();
      return 0
    }

    this.tableInstance.setFilter(matchAny, {value: this.search})
    return 1
  }


  buildStructure() {
    if (!this.tableConfig) {
      this.tableConfig = {}
    }


    let currentstructure = {}
    let columns = []
    for (const itemName in this.structure) {

      const item: object = this.structure[itemName];
      if (Object.keys(item).includes("visible") && !item["visible"] && this.visibleColumns.indexOf(itemName) === -1) {
        continue
      }
      if (this.visibleColumns.indexOf(item) === -1) {
        this.visibleColumns.push(item)
        item["visible"] = true;
      }
      if (itemName === "sortindex") {
        this.moveablerows = true;
        continue
      }
      let title = itemName;
      if (item["descr"].length > 0) {
        title = item["descr"]
      }
      //Fixme inefficient
      columns.push({
        title: title, field: itemName,
        formatterParams: [item, this], formatter: boneFormatter,
        variableHeight: true,
        editorParams: [item, this], editor: boneEditor,
        editable: this.editCheck,
        name: itemName,

      })


    }
    if (this.customColumns) {
      /**
     this.customColumns must have a specific format like
     [{ name:'column name',
        title:'column title',
        formater://somekind of a function the return value is shown in cell
     }]
     */

      for (const column of this.customColumns) {

        columns.push({
          title: column["title"],
          formatter: column["formatter"],
          variableHeight: true,
          name: column["name"],
        })
      }
    }


    currentstructure["columns"] = columns
    this.tableConfig = {...this.tableConfig, ...currentstructure}
    this.tableConfig["editabletable"] = this.editabletable
    console.log(this.tableConfig["columns"][0]["name"])
    if (this.mode === "hierarchy") {
      this.tableConfig["dataTree"] = true;
      this.tableConfig["dataTreeElementColumn"] = this.tableConfig["columns"][0]["name"];
      this.tableConfig["dataTreeChildIndent"] = 10;

    }
  }

  editCheck(cell) {
    return this.params[1]._editabletable;
  }


  updateConfig() {

    this.tableConfig["height"] = this.height
    this.tableConfig["minHeight"] = this.minheight
    this.tableConfig["placeholder"] = this.placeholder
    this.tableConfig["autoResize"] = false; // todo make editable  ??  this is true the tabel will be redrawed everytime if we go in edit mode

    if (this.sort) {
      this.tableConfig["initialSort"] = [{column: this.sort, dir: "asc"}]
    }

    if (this.moveablecolumns) {
      this.tableConfig["movableColumns"] = true
    }
    if (this.rowindexes) {
      let indexColumn = {formatter: "rownum", title: "ID", hozAlign: "center", width: 65, headerSort: false}

      if (!Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length === 0) {
        this.tableConfig["columns"] = [indexColumn]
      } else {
        this.tableConfig["columns"] = [indexColumn, ...this.tableConfig["columns"]]
      }
    }

    if (this.rowselect) {
      if (this.mode === "list") {
        let selectColumn = {
          formatter: this.slRowSelection,
          resizable: false,
          width: 35,
          minWidth: 35,
          titleFormatter: this.slRowSelection,
          hozAlign: "center",
          headerSort: false,
        }

        if (!Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length === 0) {
          this.tableConfig["columns"] = [selectColumn]
        } else {
          this.tableConfig["columns"] = [selectColumn, ...this.tableConfig["columns"]]
        }

        this.tableConfig["selectable"] = this.rowselect;
      }
      if (this.mode === "hierarchy") {
        this.tableConfig["selectable"] = 1;
      }


    }

    if (this.moveablerows) {
      this.tableConfig["movableRows"] = true;

      let handleColumn = {
        rowHandle: true,
        resizable: false,
        formatter: "handle",
        headerSort: false,
        frozen: true,
        width: 40,
        minWidth: 40
      }

      if (!Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length === 0) {
        this.tableConfig["columns"] = [handleColumn]
      } else {
        this.tableConfig["columns"] = [handleColumn, ...this.tableConfig["columns"]]
      }

    }

    if (!this.nocolumnsmenu) {
      if (!Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length === 0) {
        let menuColumn = {
          resizable: false,
          headerSort: false,
          frozen: true,
          width: 47,
          minWidth: 47,
          headerMenu: this.headerMenu
        }
        this.tableConfig["columns"] = [menuColumn]
      } else {
        for (let col of this.tableConfig["columns"]) {
          if (["handle", "rownum", this.slRowSelection].includes(col["formatter"])) {
            continue
          }
          col["headerMenu"] = this.headerMenu
        }
      }
    }
    if (this.mode === "hierarchy") {
      /*
      let handleColumn = {
        resizable: true,
        headerSort: false,
        frozen: true,
        width: 70,
        minWidth: 40
      }

      if (!Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length === 0) {
        this.tableConfig["columns"] = [handleColumn]
      } else {
        this.tableConfig["columns"] = [handleColumn, ...this.tableConfig["columns"]]
      }

       */

      this.tableConfig["dataTreeExpandElement"] = '<div class="tabulator-collapse-chevron expand"><sl-icon name="play"></sl-icon></div>';
      this.tableConfig["dataTreeCollapseElement"] = '<div class="tabulator-collapse-chevron"><sl-icon name="play"></sl-icon></div>';

    }
  }

  headerMenu() {
    var menu = [];
    var columns = this.getColumns(); //this == TabulatorInstance

    for (let column of columns) {
      let titleString = column.getDefinition().title
      if (!titleString) {
        continue
      }

      let label = document.createElement("span");
      let title = document.createElement("span");
      title.textContent = " " + titleString;
      let check = document.createElement("sl-checkbox")

      label.appendChild(check);
      label.appendChild(title);

      if (column.isVisible()) {
        check.checked = true
      } else {
        check.checked = false
      }

      //create menu item
      menu.push({
        label: label,
        action: function (event: Event) {
          event.stopPropagation();
          event.preventDefault();

          column.toggle();
          if (column.isVisible()) {
            check.checked = true
          } else {
            check.checked = false
          }
        }
      });
    }
    return menu;

  }

  slRowSelection(cell: any, formatterParams: any, onRendered: any) {
    var checkbox = document.createElement("sl-checkbox");
    var blocked = false;

    checkbox.setAttribute("aria-label", "Select Row");
    //ts-ignore
    if (this.table.modExists("selectRow", true)) {

      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      if (typeof cell.getRow == 'function') {
        var row = cell.getRow();

        if (row instanceof RowComponent) {

          checkbox.addEventListener("sl-change", (e) => {
            if (this.table.options.selectableRangeMode === "click") {
              if (!blocked) {
                row.toggleSelect();
              } else {
                blocked = false;
              }
            } else {
              row.toggleSelect();
            }
          });

          if (this.table.options.selectableRangeMode === "click") {
            checkbox.addEventListener("click", (e) => {
              blocked = true;
              this.table.modules.selectRow.handleComplexRowClick(row._row, e);
            });
          }

          checkbox.checked = row.isSelected && row.isSelected();
          this.table.modules.selectRow.registerRowSelectCheckbox(row, checkbox);
        } else {
          //@ts-ignore
          checkbox = "";
        }
      } else {
        checkbox.addEventListener("sl-change", (e: Event) => {
          if (this.table.modules.selectRow.selectedRows.length) {
            this.table.deselectRow();
          } else {
            this.table.selectRow(formatterParams.rowRange);
          }
        });

        this.table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
      }
    }

    return checkbox;
  }

  getTable() {
    /** store table element */
      // @ts-ignore
    let childs = this.slotContent()
    //prebuild Table
    if (childs.length > 0 && childs[0].tagName === "TABLE") {
      let orgTable = childs[0]
      orgTable.classList.add("striped", "celled")

      if (this.external) {
        return orgTable
      }

      let tableElement = this.shadowtable.appendChild(orgTable.cloneNode(true))
      orgTable.remove()
      return tableElement

    }
    return 0

  }

  postBuildTable() {
    console.log("rowSelectionChanged inti",this)

    this.tableInstance.on("rowSelectionChanged", (data: any, rows: any) => {
      console.log("here rowSelectionChanged")
      this.emit('sl-selectionChanged', {detail: {data: data, row: rows}})
    })
    this.tableInstance.on("cellDblClick", (date: any, cell: any) => {
      this.emit('sl-dblclick', {detail: {cell: cell}})
    });

    const element = this.tableInstance.rowManager.getElement();
    const self = this;
    this.tableInstance.on("scrollVertical", function (top, dir) {
      var diff;
      diff = element.scrollHeight - element.clientHeight - top;
      if (top > diff && !self.inScrollEvent) {

        self.inScrollEvent = true;
        self.emit("table-fetchData");//TODo rename event
      }


    });
    this.shadowtable.style.display = "block";
  }

  prebuildTable() {
    let tableElement = this.getTable()

    if (!tableElement || !tableElement.parentNode || this.tableInstance) {
      return 0
    }
    this.updateConfig()
    this.tableInstance = new TabulatorFull(tableElement,
      this.tableConfig)

    this.tableInstance.on("tableBuilt", () => {
      this.postBuildTable()
      this.tableReady = true
    })
    return 1
  }

  slotContent() {
    // @ts-ignore
    const childs = this.shadowRoot!.querySelector("slot").assignedElements({flatten: true})
    if (childs.length === 0) {
      return []
    }
    return childs
  }

  setVisibleColumns(value) {
    this.visibleColumns = value;
    this.buildStructure();
    this.updateConfig();
  }

  getVisibleColumns() {
    return this.visibleColumns;
  }

  render() {
    return html`
      <div id="shadowtable" style="display: none" part="base" class="striped celled tabulator-${this.mode}">

      </div>
      <slot @slotchange="${this.prebuildTable}"></slot>

    `;
  }
};

declare global {
  interface HTMLElementTagNameMap {
    'sl-table': SlTable;
  }
}
