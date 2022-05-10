import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { watch } from '../../internal/watch';
import { watchProps } from '../../internal/watchProps';
import styles from './table.styles';
import {TabulatorFull} from './tabulator_esm.js';

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @dependency sl-example
 *
 * @event sl-event-name - Emitted as an example.
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customElement('sl-table')
export default class SlTable extends LitElement {
  static styles = styles;

  @query('#shadowtable') shadowtable: HTMLInputElement;

  @property({type:String, reflect: true}) placeholder:String = "No Data Available"
  @property({type:String, reflect: true}) height:String = "auto"
  @property({type:String, reflect: true}) sort:any = null
  @property({type:String, reflect: true}) search:String = ''
  @property({ type: Boolean, reflect: true }) moveablecolumns:Boolean = false;

  @property({ type: Boolean, reflect: true }) rownumbers:Boolean = false;
  @property({ type: Boolean, reflect: true }) moveablerows:Boolean = false;
  @property({ type: String, reflect: true }) rowselect:String = ""; //single / multiple

  @property({ type: Array, attribute: false }) skellist: Object;
  @property({ type: Object, attribute: false }) structure: Object;
  @property({ type: Object, attribute: false }) tableConfig: Object = {
      responsiveLayout:"hide",
      layout:"fitColumns",
      reactiveData:true,
      movableColumns:true
    };

  tableInstance:any;
  tableReady:Boolean = false
  previousStructure:any=null;

  @watchProps(['structure', 'skellist'])
  optionUpdate(){
    //only rebuild table if structure changed
    if (this.previousStructure!==this.structure){
        this.previousStructure = this.structure

        this.buildStructure()
        this.tableConfig["height"] = this.height
        this.tableConfig["placeholder"] = this.placeholder
        if (this.sort){
           this.tableConfig["initialSort"] = [{column:this.sort, dir:"asc"}]
        }
        console.log(this.tableConfig)

        this.tableInstance = new TabulatorFull(this.shadowtable, this.tableConfig)
        this.tableInstance.on("tableBuilt",()=>{
            this.tableInstance.setData(this.skellist)
            this.tableReady=true
        })
    }
    //update Data only if tableReady
    if(this.tableReady){
      this.tableInstance.setData(this.skellist)
    }
  }

  @watchProps(['search'])
  performFilter(){
    function matchAny(data, filterParams) {
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

    if (!this.tableInstance){
      return 0
    }
    if(!this.search || this.search ===''){
      this.tableInstance.clearFilter();
      return 0
    }

    this.tableInstance.setFilter(matchAny,{value:this.search})
  }

  buildStructure(){
    if (!this.tableConfig){
      this.tableConfig = {}
    }

    let currentstructure = {}
    let columns = []
    for( let itemName in this.structure){
      let item = this.structure[itemName]
      if(Object.keys(item).includes("visible") && !item["visible"]){
        continue
      }
      columns.push({title:item["descr"], field:itemName})
    }

    currentstructure["columns"] = columns
    this.tableConfig = {...this.tableConfig, ...currentstructure}
  }

  getTable(){
    /** store table element */
    // @ts-ignore
    let childs = this.slotContent()

    //prebuild Table
    if(childs.length>0 && childs[0].tagName === "TABLE"){
      let orgTable = childs[0]
      orgTable.classList.add("striped","celled")
      let tableElement = this.shadowtable.appendChild(orgTable.cloneNode(true))
      orgTable.remove()
      return tableElement
    }
    return 0

  }

  prebuildTable(){
    let tableElement = this.getTable()
    if(tableElement){
      this.tableInstance = new TabulatorFull(tableElement,
      this.tableConfig)
    }
  }


  slotContent(){
     const childs = this.shadowRoot!.querySelector("slot").assignedElements({flatten: true})
      if (childs.length===0) {
        return []
      }
      return childs
  }

  render() {
    return html`
      <div style="width:100%;height:100%">
        <div id="shadowtable" part="base" class="striped celled">

        </div>
      </div>
      <slot style="display: none" @slotchange="${this.prebuildTable}"></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-table': SlTable;
  }
}
