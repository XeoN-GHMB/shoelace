import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './table-wrapper.styles';
// @ts-ignore
import naturalCompare from 'string-natural-compare';

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @slot - The default slot.
 *
 * @csspart search - The search Field.
 */
@customElement('sl-table-wrapper')
export default class SlTableWrapper extends LitElement {
  static styles = styles;
  tableElement:any;
  sortOrder = ["asc","desc","none"]

  /** Wenn set searchField is shown */
  @property({ type: Boolean, reflect: true }) searchable = false;

  /** Wenn set table header is sortable */
  @property({ type: Boolean, reflect: true }) sortable = false;



  createTableSortHead(){
    /** append sl-icons to show sort state */
    if (!this.tableElement){
      return 0;
    }
    let allTHs = this.tableElement.querySelectorAll("th")

    let i = 0
    for(let aTH of allTHs){
      aTH.dataset.column = i
      aTH.dataset.sort = "none"

      let sortMarker = document.createElement("sl-icon")
      sortMarker.setAttribute("name","")
      aTH.appendChild(sortMarker)
      i++
    }
    return 1
  }


  createTable(){
    /** collect Tabel and create header if needed */
    this.getTable()
    if (this.sortable){
      this.createTableSortHead()
    }

  }


  getTable(){
    /** store table element */
    // @ts-ignore
    const childs = this.shadowRoot!.querySelector("slot").assignedElements({flatten: true})
    if (childs.length===0){
      return 0
    }
    this.tableElement = childs[0].querySelector("table")
    return 1
  }


  toggleOrder(e:any){
    /** slot Clickhandler, currently only used for sorting */
    if (!this.sortable){
      return 0
    }

    let cth = e.target.closest("th")
    if (e.target.closest("th")){
      let allTHs = this.tableElement.querySelectorAll("th")
      for(let aTH of allTHs){
        aTH.querySelector("sl-icon").setAttribute("name", "")
      }

      cth.dataset.sort=this.sortOrder[this.sortOrder.indexOf(cth.dataset.sort)===2?0:(this.sortOrder.indexOf(cth.dataset.sort)+1)%2]
      cth.querySelector("sl-icon").setAttribute("name", cth.dataset.sort ==="asc"?"arrow-up":"arrow-down")
      sortTable(this.tableElement,cth.dataset.column,cth.dataset.sort)
    }
    return 1
  }

  filterTable(e:any){
    /** search input handler */
    searchTable(this.tableElement,e.target.value)
  }


  clearSearchField(){
    /** search input clear handler */
    searchTable(this.tableElement,"")
  }

  render() {
    return html`
      ${this.searchable? html`
      <sl-input part="search" placeholder="Search" clearable @input="${this.filterTable}" @sl-clear="${this.clearSearchField}"></sl-input>`:""
      }

      <slot @click="${this.toggleOrder}" @slotchange=${this.createTable}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-table-wrapper': SlTableWrapper;
  }
}

/** Sort a givn table, idx is the column, direction can be asc or desc */
function sortTable(table:HTMLTableElement,idx:number,direction:string) {
  var rows, switching, i, x, y, shouldSwitch;
  switching = true;

  while (switching) {
    switching = false;

    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[idx];
      y = rows[i + 1].getElementsByTagName("TD")[idx];
      try {
        let sortResult = naturalCompare(x.innerHTML.toLowerCase(), y.innerHTML.toLowerCase())

        if (direction === "asc") {
          if (sortResult > 0) {
            shouldSwitch = true;
            break;
          }
        } else if (direction === "desc") {
          if (sortResult < 0) {
            shouldSwitch = true;
            break;
          }
        }


      }catch(e){}

    }
    if (shouldSwitch) {
      // @ts-ignore
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

/** Search in a givn table for searchString*/
function searchTable(table:HTMLTableElement, searchString:string) {
  let tr = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    let tds = tr[i].getElementsByTagName("td");
    for (let td of tds){
      if (td) {
        try{
          let txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(searchString.toUpperCase()) > -1 || !searchString) {
            tr[i].style.display = "";
            break; // if we found one match in a row go to next
          } else {
            tr[i].style.display = "none";
          }
        }catch(e){

        }
      }
    }
  }
}


