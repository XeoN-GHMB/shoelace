// @ts-nocheck
import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { watchProps } from '../../internal/watchProps';
import styles from './table.styles';
//@ts-ignore
import {TabulatorFull, RowComponent} from './tabulator_esm.js';

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
export default class SlTable extends LitElement {
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
  @property({type: Boolean, reflect: true}) rowselect: Boolean = false;

  /** disable columnselection menu?*/
  @property({type: Boolean, reflect: true}) nocolumnsmenu: Boolean = false;

  /** set skellist as tabledata ?*/
  @property({type: Array, attribute: false}) skellist: Object;

  /** set a structure to generate table head */
  @property({type: Object, attribute: false}) structure: Object;

  /** Override table config Object */
  @property({type: Object, attribute: false}) tableConfig: Object = {
    responsiveLayout: "hide",
    layout: "fitColumns",
    reactiveData: true,
    popupContainer: true
  };

  tableInstance: any;
  tableReady: Boolean = false;
  previousStructure: any = null;

  @watchProps(['structure', 'skellist'])
  optionUpdate() {
    //only rebuild table if structure changed
    if (this.previousStructure !== this.structure) {
      this.previousStructure = this.structure

      this.buildStructure()
      this.updateConfig()
      if (!this.shadowtable) {
        return 0
      }
      this.tableInstance = new TabulatorFull(this.shadowtable, this.tableConfig)
      this.tableInstance.on("tableBuilt", () => {
        this.postBuildTable()
        this.tableInstance.setData(this.skellist)
        this.tableReady = true
      })

    }
    //update Data only if tableReady
    if (this.tableReady) {
      this.tableInstance.setData(this.skellist)

    }
    return 1
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
    for (let itemName in this.structure) {
      let item = this.structure[itemName]
      if (Object.keys(item).includes("visible") && !item["visible"]) {
        continue
      }
      columns.push({title: item["descr"], field: itemName, formatterParams: item, formatter: "html"})
    }

    currentstructure["columns"] = columns
    this.tableConfig = {...this.tableConfig, ...currentstructure}
  }

  updateConfig() {
    this.tableConfig["height"] = this.height
    this.tableConfig["minHeight"] = this.minheight
    this.tableConfig["placeholder"] = this.placeholder
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
      let selectColumn = {
        formatter: this.slRowSelection,
        resizable: false,
        width: 47,
        minWidth: 47,
        titleFormatter: this.slRowSelection,
        hozAlign: "center",
        headerSort: false,
        cellClick: function (e, cell) {
          cell.getRow().toggleSelect();
        }
      }

      if (!Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length === 0) {
        this.tableConfig["columns"] = [selectColumn]
      } else {
        this.tableConfig["columns"] = [selectColumn, ...this.tableConfig["columns"]]
      }

    }

    if (this.moveablerows) {
      this.tableConfig["movableRows"] = true

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
    this.tableInstance.on("rowSelectionChanged", (data: any, rows: any) => {
      emit(this, 'sl-selectionChanged', {detail: {data: data, row: rows}})
    })
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

  render() {
    return html`
      <div style="width:100%;height:100%">
        <div id="shadowtable" style="display: none" part="base" class="striped celled">

        </div>
        <slot @slotchange="${this.prebuildTable}"></slot>
      </div>
    `;
  }
};

declare global {
  interface HTMLElementTagNameMap {
    'sl-table': SlTable;
  }
}
