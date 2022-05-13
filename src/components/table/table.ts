import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { watch } from '../../internal/watch';
import { watchProps } from '../../internal/watchProps';
import styles from './table.styles';
import {DateTime} from 'luxon';
window.DateTime = DateTime;
import {TabulatorFull, RowComponent, FormatModule} from './tabulator_esm.js';

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
  @property({type:String, reflect: true}) minheight:String = "auto"
  @property({type:String, reflect: true}) sort:any = null
  @property({type:String, reflect: true}) search:String = ''

  @property({ type: Boolean, reflect: true }) moveablecolumns:Boolean = false;
  @property({ type: Boolean, reflect: true }) moveablerows:Boolean = false;

  @property({ type: Boolean, reflect: true }) rowindexes:Boolean = false;
  @property({ type: Boolean, reflect: true }) rowselect:Boolean = false;

  @property({ type: Boolean, reflect: true }) nocolumnsmenu:Boolean = false;

  @property({ type: Array, attribute: false }) skellist: Object;
  @property({ type: Object, attribute: false }) structure: Object;
  @property({ type: Object, attribute: false }) tableConfig: Object = {
      responsiveLayout:"hide",
      layout:"fitColumns",
      reactiveData:true,
      popupContainer:true
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
        this.updateConfig()
        console.log(this.tableConfig)
        if (!this.shadowtable){
          return 0
        }
        this.tableInstance = new TabulatorFull(this.shadowtable, this.tableConfig)
        this.tableInstance.on("tableBuilt",()=>{
            this.postBuildTable()
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

      let format = this.typeToFormatName(item)
      columns.push({title:item["descr"], field:itemName, formatter:format, formatterParams:item})
    }

    currentstructure["columns"] = columns
    this.tableConfig = {...this.tableConfig, ...currentstructure}
  }

  typeToFormatName(item){
    let formatter = "plain"
    //if (item["type"].startsWith("text"))
      console.log(item)
    if(item["languages"] && item["multiple"]){
      console.log("A")
    }else if (item["languages"]){
      formatter = this.multiLanguageFormatter
    }else if(item["multiple"]){
        console.log("C")
    }else if (item["type"]){
      console.log("D")
      // not lang and not multi
      if(item["type"].startsWith("date")){
        formatter = "datetime"
        item["outputFormat"] = "dd.MM.yyyy HH:mm:ss"
        item["inputFormat"] = "iso"
      }else if (item["type"].startsWith("text")){
        formatter = "text"
      }else if (item["type"].startsWith("select")){
        //formatter = "lookup"
      }else if (item["type"].startsWith("color")){
        formatter = "color"
      }
    }

    return formatter
  }


  multiLanguageFormatter(cell, formatterParams, onRendered){
    let value = cell.getValue();


    console.log(formatterParams)
    let renderSingleValue = (value)=>{
      console.log(value)
      if(formatterParams["type"].startsWith("date")){
        formatterParams["outputFormat"] = "dd.MM.yyyy HH:mm:ss"
        formatterParams["inputFormat"] = "iso"
        value = format_datetime(cell, formatterParams,onRendered, value)

      }else if (formatterParams["type"].startsWith("text")){
        value = format_textarea(cell, formatterParams,onRendered, value)

      }else if (formatterParams["type"].startsWith("select")){
        //formatter = "lookup"
      }else if (formatterParams["type"].startsWith("color")){
        value = format_color(cell, formatterParams,onRendered, value)

      }else{
        value = format_plaintext(cell, formatterParams,onRendered, value)
         console.log(value)
      }

      if (typeof value === "string"){
        value =document.createTextNode(value)
      }
      console.log(value)
      return value
    }

    let returnValue = document.createElement("span")


    for(let lang of formatterParams["languages"]){
      if (formatterParams["multiple"]){

      }else{

        let langValue = value[lang] || '-'

        returnValue.appendChild(document.createTextNode(lang+": "))
        returnValue.appendChild(renderSingleValue(langValue))
      }


    }



    return returnValue
  }


  updateConfig(){
    this.tableConfig["height"] = this.height
    this.tableConfig["minHeight"] = this.minheight
    this.tableConfig["placeholder"] = this.placeholder
    if (this.sort){
       this.tableConfig["initialSort"] = [{column:this.sort, dir:"asc"}]
    }

    if (this.moveablecolumns){
      this.tableConfig["movableColumns"] = true
    }
    if(this.rowindexes){
      let indexColumn = {formatter:"rownum", title:"ID", hozAlign:"center", width:65, headerSort:false}

      if ( !Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length===0){
        this.tableConfig["columns"] = [indexColumn]
      }else{
        this.tableConfig["columns"] = [ indexColumn ,...this.tableConfig["columns"]]
      }
    }

    if (this.rowselect){
      let selectColumn = {formatter:this.slRowSelection, resizable:false, width:47, minWidth:47, titleFormatter:this.slRowSelection, hozAlign:"center", headerSort:false, cellClick:function(e, cell){
        cell.getRow().toggleSelect();
      }}

      if ( !Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length===0){
        this.tableConfig["columns"] = [selectColumn]
      }else{
        this.tableConfig["columns"] = [ selectColumn ,...this.tableConfig["columns"]]
      }

    }

    if(this.moveablerows){
      this.tableConfig["movableRows"] = true

      let handleColumn = {rowHandle:true, resizable:false, formatter:"handle", headerSort:false, frozen:true, width:40, minWidth:40}

      if ( !Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length===0){
        this.tableConfig["columns"] = [handleColumn]
      }else{
        this.tableConfig["columns"] = [ handleColumn ,...this.tableConfig["columns"]]
      }
    }

    if (!this.nocolumnsmenu){
        if ( !Object.keys(this.tableConfig).includes("columns") || this.tableConfig["columns"].length===0){
          let menuColumn = {resizable:false, headerSort:false, frozen:true, width:47, minWidth:47, headerMenu:this.headerMenu}
          this.tableConfig["columns"] = [menuColumn]
        }else{
          for(let col of this.tableConfig["columns"] ){
            if (["handle","rownum",this.slRowSelection].includes(col["formatter"])){
              continue
            }
            col["headerMenu"]=this.headerMenu
          }
          //this.tableConfig["columns"] = [ menuColumn ,...this.tableConfig["columns"]]
        }
    }

    for(let col of this.tableConfig["columns"] ){
      if (!col["formatter"]){
        //col["formatter"] = this.vCellRenderer
      }

    }

  }

  headerMenu(){
    var menu = [];
    var columns = this.getColumns(); //this == TabulatorInstance

    for(let column of columns){
        let titleString = column.getDefinition().title
        if (!titleString){
          continue
        }

        let label = document.createElement("span");
        let title = document.createElement("span");
        title.textContent = " " + titleString;
        let check = document.createElement("sl-checkbox")

        label.appendChild(check);
        label.appendChild(title);

        if(column.isVisible()){
            check.checked = true
        }else{
            check.checked = false
        }

        //create menu item
        menu.push({
            label:label,
            action:function(event){
                event.stopPropagation();
                event.preventDefault();

                column.toggle();
                  if(column.isVisible()){
                      check.checked = true
                  }else{
                      check.checked = false
                  }
            }
        });
    }
   return menu;

  }

  slRowSelection(cell, formatterParams, onRendered){
    var checkbox = document.createElement("sl-checkbox");
    var blocked = false;

    checkbox.setAttribute("aria-label", "Select Row");

    if(this.table.modExists("selectRow", true)){

      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      if(typeof cell.getRow == 'function'){
        var row = cell.getRow();

        if(row instanceof RowComponent){

          checkbox.addEventListener("sl-change", (e) => {
            if(this.table.options.selectableRangeMode === "click"){
              if(!blocked){
                row.toggleSelect();
              }else {
                blocked = false;
              }
            }else {
              row.toggleSelect();
            }
          });

          if(this.table.options.selectableRangeMode === "click"){
            checkbox.addEventListener("click", (e) => {
              blocked = true;
              this.table.modules.selectRow.handleComplexRowClick(row._row, e);
            });
          }

          checkbox.checked = row.isSelected && row.isSelected();
          this.table.modules.selectRow.registerRowSelectCheckbox(row, checkbox);
        }else {
          checkbox = "";
        }
      }else {
        checkbox.addEventListener("sl-change", (e) => {
          if(this.table.modules.selectRow.selectedRows.length){
            this.table.deselectRow();
          }else {
            this.table.selectRow(formatterParams.rowRange);
          }
        });

        this.table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
      }
    }

    return checkbox;
  }

  vCellRenderer(cell, formatterParams, onRendered){
    /* Defaults
    plaintext, textarea, html, money, image, link, datetime,
    datetimediff, tickCross, color, star, traffic, progress,
    lookup, buttonTick, buttonCross, rownum, handle,

    select = lookup
    file = image, link
    plain = string, numeric
    text = textare, html
    date = datetime
    color = color

    http://tabulator.info/docs/5.2/format#format-custom

    lang > multi > types

    * */
    console.log(this.table)
    console.log(this)

    let xx = new FormatModule(this.table)
    console.log(xx.getFormatter("plaintext")(cell, formatterParams, onRendered))
    console.log(xx.formatters["plaintext"](cell, formatterParams, onRendered))
    return "plain"
  }
  /*
      console.log(this.table)
    console.log()

    return "X"
    let formatMod = new FormatModule(this.tableInstance)
    return formatMod.formatters.plaintext(cell,formatterParams,onRendered)


    let languageWrapper = ()=>{

    }

    let multipleWrapper = ()=>{

    }

*/



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

  postBuildTable(){
    this.tableInstance.on("rowSelectionChanged", (data, rows)=>{
      emit(this,'sl-selectionChanged',{detail:{data:data,row:rows}})
    })
  }

  prebuildTable(){
    let tableElement = this.getTable()
    this.updateConfig()
    console.log(this.tableConfig)
    if (!tableElement){
          return 0
        }
    if(tableElement){
      this.tableInstance = new TabulatorFull(tableElement,
      this.tableConfig)

      this.postBuildTable()
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



function sanitizeHTML(value){
		if(value){
			const entityMap = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
				'/': '&#x2F;',
				'`': '&#x60;',
				'=': '&#x3D;'
			};

			return String(value).replace(/[&<>"'`=\/]/g, function (s) {
				return entityMap[s];
			});
		}else {
			return value;
		}
	}

function emptyToSpace(value){
		return value === null || typeof value === "undefined" || value === "" ? "&nbsp;" : value;
	}

function format_textarea(cell, formatterParams, onRendered,value=null){
	cell.getElement().style.whiteSpace = "pre-wrap";

  if (!value){
    value = cell.getValue()
  }
	return emptyToSpace(sanitizeHTML(value));
}

function format_plaintext(cell, formatterParams, onRendered,value=null){
  if (!value){
    value = cell.getValue()
  }
	return emptyToSpace(sanitizeHTML(value));
}

function format_image(cell, formatterParams, onRendered,value=null){
	var el = document.createElement("img"),
	src = cell.getValue();

	if(formatterParams.urlPrefix){
		src = formatterParams.urlPrefix + cell.getValue();
	}

	if(formatterParams.urlSuffix){
		src = src + formatterParams.urlSuffix;
	}

	el.setAttribute("src", src);

	switch(typeof formatterParams.height){
		case "number":
		el.style.height = formatterParams.height + "px";
		break;

		case "string":
		el.style.height = formatterParams.height;
		break;
	}

	switch(typeof formatterParams.width){
		case "number":
		el.style.width = formatterParams.width + "px";
		break;

		case "string":
		el.style.width = formatterParams.width;
		break;
	}

	el.addEventListener("load", function(){
		cell.getRow().normalizeHeight();
	});

	return el;
}


function format_datetime(cell, formatterParams, onRendered,value=null){
	var DT = window.DateTime || luxon.DateTime;
	var inputFormat = formatterParams.inputFormat || "yyyy-MM-dd HH:mm:ss";
	var	outputFormat = formatterParams.outputFormat || "dd/MM/yyyy HH:mm:ss";
	var	invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";
	var value = cell.getValue();

	if(typeof DT != "undefined"){
		var newDatetime;

		if(DT.isDateTime(value)){
			 newDatetime = value;
		 }else if(inputFormat === "iso"){
			 newDatetime = DT.fromISO(String(value));
		 }else {
			 newDatetime = DT.fromFormat(String(value), inputFormat);
		 }

		if(newDatetime.isValid){
			if(formatterParams.timezone){
				newDatetime = newDatetime.setZone(formatterParams.timezone);
			}

			return newDatetime.toFormat(outputFormat);
		}else {
			if(invalid === true || !value){
				return value;
			}else if(typeof invalid === "function"){
				return invalid(value);
			}else {
				return invalid;
			}
		}
	}else {
		console.error("Format Error - 'datetime' formatter is dependant on luxon.js");
	}
}

function format_lookup (cell, formatterParams, onRendered,value=null) {
	var value = cell.getValue();

	if (typeof formatterParams[value] === "undefined") {
		console.warn('Missing display value for ' + value);
		return value;
	}

	return formatterParams[value];
}

function format_color(cell, formatterParams, onRendered,value=null){
	cell.getElement().style.backgroundColor = this.sanitizeHTML(cell.getValue());
	return "";
}
