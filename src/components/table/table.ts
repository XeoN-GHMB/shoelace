import { html, LitElement, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { ref } from 'lit/directives/ref.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { customStyle } from '../../internal/customStyle';
import { emit } from '../../internal/event';
import resourceLocal from '../../internal/resourceLocal';
import { spread, SpreadResult } from '../../internal/spread';
import { watch } from '../../internal/watch';
import { watchProps } from '../../internal/watchProps';
import { isArray, isFunction } from '../../utilities/common';
import { getResouceValue } from '../../utilities/getResouce';
import { addResizeHander, DisposeObject } from '../../utilities/resize.util';
import SlColumn from '../column/column';
import '../icon/icon';
import '../spinner/spinner';
import { iteratorNodeData, TreeNodeData } from '../tree-node/tree-node-util';
import styles from './table.styles';
import { removeTableCacheByKey, restoreFromLocalCache } from './tableCacheHelper';
import { CellContext, CellHeadContext, defaultSortConfig, defaultTreeConfig, RowContext, SortConfig, SortValue, TreeConfig } from './tableConfig';
import { connectTableHanlder, getTreeNodeAllChildrenSize } from './tableEventHelper';
import caculateColumnData, { getColumnCacheData, RowHeader } from './tableHelper';
import { getCellContext, getTableHeadCellContext, renderTdCellTemplate, renderThColTemplate } from './tableRenderHelper';
import { vituralScrollCalc } from './virtualScroll';

const rowContextMap = new WeakMap<HTMLTableRowElement, RowContext>();
const setRowContext = (tr: HTMLTableRowElement, context: RowContext) => {
  if (tr) {
    rowContextMap.set(tr, context);
  }
};

/** Obtain table tbody tr context */
export const getRowContext = (tr: HTMLTableRowElement) => {
  return rowContextMap.get(tr) as RowContext;
};

export type TreeNodeCacheType = {
  parent: TreeNodeData;
  level: number;
  seqno: number;
};

let componentID = 0;

/**
 * @since 2.0
 * @status experimental
 *
 * @dependency  sl-column,sl-icon,sl-spinner
 *
 * @event sl-table-resize - Emitted table resize.
 *
 * @event {{div:HTMLDIVElement}} sl-table-scroll - Emitted scroll table.
 * @event {{column:SLColumn,sortValue:current sort value}} sl-table-sort - Emitted table column sort.
 * @event {{column:SLColumn,sortValue:value before sorting}} sl-table-before-sort - Emitted before table column sort.
 *
 *
 * @event {{column:SLColumn,change:changed width}}  sl-table-column-resize - Emitted table column width change by drag.
 *
 *
 * @event {{dom:HTMLElement,context:CellContext}}  sl-tree-node-before-open - Emitted before table tree node to open   . tree event
 * @event {{dom:HTMLElement,context:CellContext}}  sl-tree-node-before-close - Emitted before table tree node to close  . tree event
 * @event {{dom:HTMLElement,context:CellContext}}  sl-tree-node-before-toogle - Emitted before table tbody td node state toogle  . tree event
 * @event {{dom:HTMLElement,context:CellContext}}  sl-tree-node-open - Emitted after table tbody td node state toogle  . tree event
 * @event {{dom:HTMLElement,context:CellContext}}  sl-tree-node-toogle - Emitted after table tbody td node state toogle  .tree event
 * @event {{dom:HTMLElement,context:CellContext}}  sl-tree-node-loaded - after table tree node lazy load children end  .tree load event
 * @event {{dom:HTMLElement,context:CellContext}}  sl-tree-node-load-error - Emitted after table tbody td node state toogle  .tree event
 *
 *  //tbody row, tbody tr event
 * @event {{row:TR,context:RowContext}}  sl-table-tr-${normalEvent} - Emitted table tbody tr trigger normalEvent .support normalEvent event [click,dblclick,keydown,keypress,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup]  .
 * //tbody row, tbody tr td event
 * @event {{row:TR,td:TD,context:CellContext}}  sl-table-td-${normalEvent} - Emitted table tbody td trigger normalEvent.  support normalEvent  event [click,dblclick,keydown,keypress,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup].
 * @event {{td:TD,dom:HTMLElement,context:CellContext,value:any}}  sl-table-cell-edit-commit - when Table cell edit data change,trigger.
 *
 * @event {{td:TD,context:CellContext}}   sl-table-cell-edit-before-change- Emitted  before when table  edit cell  change .
 * @event {{td:TD,dom:HTMLElement,context:CellContext}}  sl-cell-edit-start - When the cell starts to enter the editing state (the cell has not become the editing state at this time, you can unblock the event）
 * @event {{td:TD,dom:HTMLElement,context:CellContext}}  sl-cell-edit-active - Triggered when the cell enters the edit state
 * //EDIT order（sl-table-cell-edit-before-change->sl-cell-edit-start->sl-table-cell-edit-active)
 * //form checkbox control
 * @event {{checkbox:SlCheckbox,context:CellContext }}   sl-table-check-before-change - Emitted  before  tbody checkbox check will change .
 * @event {{checkbox:SlCheckbox,context:CellContext }}   sl-table-check-head-before-change - Emitted  before when column checkbox will change .
 * @event {{value:Array<any> }}   sl-table-check-change - Emitted  after  tbody checkbox check  changed.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * @slot no-data - no-data slot.
 *
 *
 * @csspart base - The component's base wrapper.
 * @csspart scroll-div - The component's scroll-div .
 * @csspart table - The component's table .
 * @csspart resize-hanler - The th's resize-hanlder .
 *
 * @cssproperty --sl-th-padding-size - td,th padding
 * @cssproperty --sl-table-border-color - border color , such as 220,180,19 the color of this number format
 * @cssproperty --sl-table-background-color - table background color, such as 220,180,19 the color of this number format
 * @cssproperty --sl-table-td-right-width -1px，Defines the width of the line to the right of the table cell
 * @cssproperty --sl-table-td-bottom-width -1px，Defines the line width on the bottom side of the table cell
 *
 */
@resourceLocal()
@customStyle()
@customElement('sl-table')
export default class SlTable extends LitElement {
  static styles = styles;

  @state()
  componentID = `${'tableID_' + componentID++}`;

  /** td size*/
  @property({ type: String, attribute: false, reflect: true }) size: 'small' | 'larger' | 'default' = 'small';

  /** Whether the table shows border */
  @property({ type: Boolean, attribute: true, reflect: true }) border: boolean = false;

  /** Whether table supports mouse activity row color change */
  @property({ type: Boolean, attribute: false, reflect: true }) hoverAble: boolean = true;

  /** table supports stripes */
  @property({ type: Boolean, attribute: false, reflect: true }) stripe: boolean = false;

  /** The data that the table needs to render must be an array*/
  @property({ type: Array, attribute: false }) dataSource: unknown[];

  @property({ type: Object, attribute: false }) sortConfig: SortConfig = { ...defaultSortConfig };
  /** The current sort value of the table */
  @property({ type: Object, attribute: false }) sortValue?: SortValue | Array<SortValue>;

  @property({ type: Object, attribute: false }) treeConfig?: TreeConfig;

  /** Whether the table is fixed footer to the bottom */
  @property({ type: Boolean, attribute: false, reflect: true }) fixedFoot: boolean = false;

  /** Render tfooter This method receives all the columns and returns the tr template list composed of footers */
  @property({ type: Object })
  customRenderFooter: (columns: SlColumn[]) => TemplateResult<1>;

  /** table cache ID */
  @property({ type: String, reflect: true, attribute: 'cache-key' }) cacheKey: string;
  @watch('cacheKey')
  locacheIDChange(oldKey: string) {
    if (oldKey) {
      removeTableCacheByKey(oldKey);
    }
    if (this.cacheKey) {
      restoreFromLocalCache(this);
    }
  }

  @watchProps(['sortConfig', 'sortValue'])
  sortConfigChange() {
    this.sortConfig = { ...defaultSortConfig, ...this.sortConfig };
    if (!this.sortConfig.multi) {
      if (Array.isArray(this.sortValue) && this.sortValue.length > 0) {
        this.sortValue = this.sortValue[this.sortValue.length - 1];
      }
    } else {
      if (!Array.isArray(this.sortValue) && this.sortValue) {
        this.sortValue = [this.sortValue];
      }
    }
  }
  /** table container maximum height */
  @property({ type: String })
  tableMaxHeight: string;

  /** table container minimum height */
  @property({ type: String })
  tableMinHeight: string;

  /** table container height, supports css like "100% - 40px" or " 100vh - 30px " */
  @property({ type: String })
  tableHeight: string;

  /** Whether the table is table-layout: fixed  */
  @property({ type: Boolean })
  tableLayoutFixed: boolean;

  /** true, then the TreeNode column will not wrap  */
  @property({ type: Boolean })
  treeNodeNoWrap: boolean;

  @query('#tableID', true)
  table: HTMLTableElement;

  @state()
  private innerDataSource: unknown[];
  /** Get the list of data that the table actually renders */
  public getRenderDataSource() {
    return this.innerDataSource;
  }

  public treeNodeHasChildren(rowData: TreeNodeData) {
    if (typeof rowData.children == 'undefined' && this.treeConfig && this.treeConfig.lazy) {
      return rowData[this.treeConfig.hasChildProp as string] as boolean;
    } else {
      return rowData.children ? rowData.children.length > 0 : false;
    }
  }

  /** When it is a Tree, store which TreeNodeData being loaded */
  @property({ type: Array, attribute: false })
  treeLoadingNode: TreeNodeData[] = [];

  /** Load TreeNode child data, receive parameters nodeData, parentData */
  @property({ type: Object })
  treeLoadingNodeMethod: (context: CellContext) => Promise<Array<TreeNodeData>>;

  /** Store which rows of data are expanded */
  @property({ type: Array, attribute: false })
  expandRowData: unknown[] = [];

  /** Specify which column triggers the row expansion data load */
  @property({ type: String, attribute: false })
  expandColumn: string;

  /** Whether to lazy load extension rows */
  @property({ type: Boolean, attribute: false })
  expandLazy: boolean = false;

  /** Specify a method for lazy loading of extensions */
  @property({ type: Object, attribute: false })
  expandLazyLoadMethod: (rowData: unknown) => Promise<any>;

  /** Whether to expand only one expanded row */
  @property({ type: Boolean, attribute: false })
  expandAccordion: boolean = false;

  /** Stores the row data being expanded */
  @state()
  expandingRowData: Array<unknown> = [];

  /** Method: Specify how to render extended rows, receive row data and leaf columns, and return <tr>Template Result */
  @property({ type: Object, attribute: false })
  expandRowRender: (rowContext: RowContext, columns: SlColumn[], layLoadData?: any) => TemplateResult<1>;
  /** Stores already loaded extension data  */
  @property({ type: Object, attribute: false })
  cacheExpandLazyLoadDataMap = new Map<any, any>();

  /**
   * Expanded data for row data
   * @param rowData table row bound data
   */
  public async doExpandRowData(rowData: unknown) {
    const table = this;
    const index = table.expandRowData.indexOf(rowData);
    const isExpend = index >= 0;
    const expandEvent = emit(table, `sl-table-expand-before`, {
      cancelable: true,
      detail: {
        expended: isExpend,
        rowData: rowData
      }
    });
    if (!expandEvent.defaultPrevented) {
      if (!isExpend) {
        //Not currently open
        if (table.expandAccordion) {
          table.expandRowData.splice(0, table.expandRowData.length);
        }
        table.expandRowData.push(rowData);
      } else {
        table.expandRowData.splice(index, 1);
      }
      table.expandRowData = [...table.expandRowData];
      table.updateComplete.then(() => {
        emit(table, 'sl-table-expand', {
          detail: {
            expended: !isExpend,
            rowData: rowData
          }
        });
      });
    }
  }

  /**Enabled when the Tree list is used, the node rendering level is cached */
  private cacheTreeNodeMap: Map<any, TreeNodeCacheType>;
  /**Get the Tree level corresponding to the rendered rowData */
  public getRowDataTreeLevel(rowData: TreeNodeData) {
    return this.cacheTreeNodeMap.get(rowData)?.level as number;
  }
  /**Get the parent object corresponding to the rendered rowData */
  public getRowDataParentData(rowData: TreeNodeData) {
    return this.cacheTreeNodeMap.get(rowData)?.parent as TreeNodeData;
  }

  /**Get the sequence number of the rendered rowData */
  public getRowDataDataIndex(rowData: TreeNodeData) {
    return this.cacheTreeNodeMap.get(rowData)?.seqno as number;
  }
  /**When Table enables Tree, get the cached data relationship */
  public get treeDataCache() {
    return this.cacheTreeNodeMap;
  }

  /**
   * table  heading
   */
  @query('thead[part=thead', true)
  thead: HTMLTableSectionElement;

  @query('div[part=base]', true)
  baseDiv: HTMLDivElement;
  /** scroll DIV */
  @query('div[part=scroll-div]', false)
  scrollDiv: HTMLDivElement;

  updated(map: PropertyValues) {
    super.updated(map);
    this.asynTableHeaderWidth();
  }
  /** Identifies whether tableAsync synchronization is in progress */
  private isAsyncTableWidth = false;
  asynTableHeaderWidth() {
    if (!this.isAsyncTableWidth) {
      this.isAsyncTableWidth = true;
      Promise.resolve().then(() => {
        //Retrofit, request multiple times, perform only one recalculation
        this.watchFixedColumnsChange();
        this.isAsyncTableWidth = false;
        emit(this, 'sl-table-resize');
      });
    }
  }
  private _resizeResult: DisposeObject;
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
    this.columnChangeHanlder();
    this._resizeResult = addResizeHander([this, this.table], () => {
      this.asynTableHeaderWidth();
    });
    connectTableHanlder(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this._resizeResult?.dispose();
  }
  private _renderNoDataTemplate() {
    //Only when the data is a blank array, it shows no data
    if (this.innerDataSource && this.innerDataSource.length == 0) {
      return html`<slot @slotchange=${this.columnChangeHanlder} name="no-data">${getResouceValue('noData')}</slot>`;
    }
    return ``;
  }
  /** Set table columns to be fixed, for example: fixedColumns="2", the first two columns are fixed, "2,2" is the first two columns, the last two columns are fixed, "0,2", [0,2] is the last two-column fixed */
  @property({ attribute: false })
  fixedColumns: string | Array<Number>;

  private caculateFixedColumnStyle(col: SlColumn, tableRect: DOMRect, fixedLeft: boolean) {
    let td = this.table.querySelector(`td[uniqueid="${col.uniqueID}"]`);
    if (!td) {
      td = this.table.querySelector(`th[uniqueid="${col.uniqueID}"]`);
    }
    if (td) {
      return `
          th[uniqueid="${col.uniqueID}"],
          td[uniqueid="${col.uniqueID}"]{
            position:sticky !important;z-index:1;
            ${fixedLeft ? `left:${td.getBoundingClientRect().left - tableRect.left}px;` : ''}
            ${!fixedLeft ? `right:${tableRect.right - td.getBoundingClientRect().right}px;` : ''}
          }
        `;
    }
    return '';
  }
  @watchProps(['fixedColumns'], { waitUntilFirstUpdate: true })
  watchFixedColumnsChange() {
    this.fixedStyleElement.textContent = '';
    let style = '';
    if (this.fixedColumns) {
      let array = Array.isArray(this.fixedColumns) ? this.fixedColumns : String(this.fixedColumns).split(',');
      let left = parseInt('' + array[0]);
      let right = array.length > 1 ? parseInt('' + array[1]) : 0;
      let thead = this.thead;
      let tableRect = thead.getBoundingClientRect();
      let columnSize = this.tdRenderColumns.length;
      if (!isNaN(left)) {
        for (let i = 0, j = Math.min(left, columnSize); i < j; i++) {
          let col = this.tdRenderColumns[i];
          while (col != null && col.tagName.toLowerCase() == 'sl-column') {
            style += this.caculateFixedColumnStyle(col, tableRect, true);
            col = col.parentElement as SlColumn;
          }
        }
      }
      if (!isNaN(right)) {
        for (let i = columnSize - 1, j = 0; j < right && i >= 0; ) {
          let col = this.tdRenderColumns[i];
          while (col != null && col.tagName.toLowerCase() == 'sl-column') {
            style += this.caculateFixedColumnStyle(col, tableRect, false);
            col = col.parentElement as SlColumn;
          }
          i--;
          j++;
        }
      }
    }
    this.fixedStyleElement.textContent = style;
  }

  @query('#styleID', true)
  private fixedStyleElement: HTMLStyleElement;
  render() {
    let tableStyle: any = {};
    this.tableHeight ? (tableStyle['height'] = `calc( ${isNaN(Number(this.tableHeight)) ? this.tableHeight : this.tableHeight + 'px'} )`) : '';
    this.tableMaxHeight ? (tableStyle['maxHeight'] = `calc( ${isNaN(Number(this.tableMaxHeight)) ? this.tableMaxHeight : this.tableMaxHeight + 'px'} )`) : '';
    this.tableMinHeight ? (tableStyle['minHeight'] = `calc( ${isNaN(Number(this.tableMinHeight)) ? this.tableMinHeight : this.tableMinHeight + 'px'} )`) : '';

    return html` <style id="styleID"></style>
      <div class="sl-table-base" part="base" size=${this.size}>
        <div class="sl-table-base-scroll-div" style=${styleMap(tableStyle)} part="scroll-div" ?hover-able=${this.hoverAble} ?stripe=${this.stripe} ?border=${this.border}>
          <!--渲染table 区 -->
          <table part="table" id="tableID" componentID=${this.componentID}>
            <thead part="thead" componentID=${this.componentID}>
              ${this._renderTheadRows()}
            </thead>
            <tbody componentID=${this.componentID}>
              ${this._renderDataSourceRows()}
            </tbody>
            <tfoot part="tfoot" class=${this.fixedFoot ? 'fixedFoot' : ''}>
              ${this.customRenderFooter ? this.customRenderFooter(this.tdRenderColumns) : ''}
            </tfoot>
          </table>
          ${this._renderNoDataTemplate()}
        </div>
        <slot @slotchange=${this.columnChangeHanlder}></slot>
      </div>`;
  }
  /** render header row header tr th */
  private _renderTheadRows() {
    const table = this;
    const trTemplates = (rowColumn: SlColumn[], rowIndex: number) => {
      return html`<tr .columns=${rowColumn}>
        ${rowColumn.map((column, index) => {
          const cache = getColumnCacheData(column);
          const context: CellHeadContext = {
            column: column,
            colIndex: index,
            rowspan: cache.rowspan as number,
            colspan: cache.colspan as number,
            colRowIndex: rowIndex
          };
          return renderThColTemplate(context, table);
        })}
      </tr>`;
    };
    return this.theadRows.map((items, index) => trTemplates(items, index));
  }

  /**Customize the style of rendering tbody td */
  @property({ type: Object, attribute: false })
  customRenderCellStyle: (context: CellContext) => StyleInfo;

  /**Customize the class that renders the tbody td  */
  @property({ type: Object, attribute: false })
  customRenderCellClassMap: (cellContext: CellContext) => ClassInfo | string | string[];

  /**Customize SpreadResult for rendering tbody td */
  @property({ type: Object, attribute: false })
  customRenderCellSpread: (cellContext: CellContext) => SpreadResult;

  /**Customize the style of rendering tHeader th */
  @property({ type: Object, attribute: false })
  customRenderCellHeadStyle: (context: CellHeadContext) => StyleInfo;

  /**Customize the class that renders thead th  */
  @property({ type: Object, attribute: false })
  customRenderCellHeadClassMap: (context: CellHeadContext) => ClassInfo | string | string[];

  /**custom render thead th SpreadResult  */
  @property({ type: Object, attribute: false })
  customRenderCellHeadSpread: (context: CellHeadContext) => SpreadResult;

  /**Customize the style of rendering tbody tr */
  @property({ type: Object, attribute: false })
  customRenderRowStyle: (rowContext: RowContext) => StyleInfo;

  /**Customize the style of rendering tHeader tr */
  @property({ type: Object, attribute: false })
  customRenderRowClassMap: (rowContext: RowContext) => ClassInfo | string | string[];

  /**Customize the Spread that renders the tbody tr */
  @property({ type: Object, attribute: false })
  customRenderRowSpread: (rowContext: RowContext) => SpreadResult;

  /** virtual scroll line height */
  @property({ type: Number, attribute: false })
  virtualItemHeight: number = 45;

  /** Virtual scrolling enabled */
  @property({ type: Number, attribute: false })
  enableVirtualScroll: number;

  //table edit mode

  /**Table editing master control: whether to allow the table editing function to be enabled */
  @property({ type: Boolean, attribute: false })
  editEnable = false;

  /** Edit mode: row: row edit (edit one row at a time, cell: cell edit (edit one TD at a time), column: column edit mode, edit one column at a time */
  @property({ type: String, attribute: false })
  editMode: 'row' | 'column' | 'cell' = 'row';

  /** Editing behavior: if editMode=row, whether to allow multiple row editing at one time, editMode=column, whether to allow multiple column editing at one time */
  @property({ type: Boolean, attribute: false })
  editAccordion = false;
  @watch('editAccordion')
  changeEditAccordion() {
    if (this.editAccordion) {
      if (this.currentEditRow && this.currentEditRow.length > 0) {
        this.currentEditRow = [this.currentEditRow[0]];
      }
      if (this.currentEditColumn && this.currentEditColumn.length > 0) {
        this.currentEditColumn = [this.currentEditColumn[0]];
      }
    }
  }

  /** Trigger events in edit mode, support click, dbclick, manual */
  @property({ type: String, attribute: false })
  editTrigger = 'click';

  /** Currently edited row data */
  @property({ type: Array, attribute: false })
  currentEditRow: Array<any> = [];

  /** the currently edited cell  */
  @state()
  currentEditCell?: { column: SlColumn; rowData: any };

  /** currently edited column */
  @property({ type: Array, attribute: false })
  currentEditColumn: Array<SlColumn> = [];

  /** Does TBody TD enable multiline...*/
  @property({ type: Boolean, attribute: false })
  enableCellBox = false;

  /** Whether TBody TD exceeds multiple lines then... */
  @property({ type: Number, attribute: false })
  cellBoxLines = 1;

  @watch('cellBoxLines', { waitUntilFirstUpdate: true })
  watchCellBoxLinesChange() {
    this.style.setProperty('--sl-table-cell-box-lines', this.cellBoxLines + '');
  }

  /** when defining the column type='checkbox', 'radio', and defines the binding property of the checkbox column. If it is not specified, the binding value of the Table checkbox column is rowData itself */
  @property({ type: String })
  checkPropField: string | ((rowData: any) => any);

  /**when you define the column type='checkbox', 'radio', determine the column checkbxradio Disable property, or a function receives rowData, determine whether the rowData checkbox column can be selected If not specified, all checkboxes in this column can be checked*/
  @property()
  checkDisablePropField: string | ((rowData: any) => boolean);

  /** Defines the current multi-selected value of the table (acting on the type=checkbox column) */
  @property({ type: Object, attribute: false })
  checkValue: any | Array<any>;

  /** Defines the value of the current radio selection in the table (applies to the type=radio column) */
  @property({ type: Object, attribute: false })
  radioValue: any;

  /** If TreeConfig is enabled, the checkbox cascades down to select */
  @property({ type: Boolean, attribute: false })
  checkTreeCasecadeDown = true;

  /** If TreeConfig is enabled, the checkboxes cascade upwards */
  @property({ type: Boolean, attribute: false })
  checkTreeCasecadeUp = false;

  /** Get rowData selected value */
  public getRowDataCheckValue(rowData: any) {
    const rowCheckValue = isFunction(this.checkPropField) ? this.checkPropField(rowData) : this.checkPropField ? rowData[this.checkPropField] : rowData;
    return rowCheckValue;
  }
  /**
   * loop through the selected data
   * @param vistorFun data processor
   */
  public forEachCheckValue(vistorFun: (rowData: any, ...args: any) => void) {
    if (this.dataSource) {
      const wrapVistor = (rowData: any, ...args: any) => {
        if (this.isRowDataChecked(rowData)) {
          vistorFun(rowData, ...args);
        }
      };
      if (this.treeConfig) {
        for (let l of this.dataSource) {
          iteratorNodeData(l as TreeNodeData, wrapVistor);
        }
      } else {
        for (let i = 0, j = this.dataSource.length; i < j; i++) {
          wrapVistor(this.dataSource[i], i);
        }
      }
    }
  }
  /** Determine whether rowData is checkbox column selected */
  public isRowDataChecked(rowData: any) {
    let rowCheckValue = this.getRowDataCheckValue(rowData);
    return isArray(this.checkValue) ? (this.checkValue as Array<any>).includes(rowCheckValue) : this.checkValue != undefined && this.checkValue == rowCheckValue;
  }

  /** Determine whether rowData is a radio column selected */
  public isRowDataRadioChecked(rowData: any) {
    let rowCheckValue = this.getRowDataCheckValue(rowData);
    return this.radioValue == rowCheckValue;
  }
  /**Determine whether rowData is checkbox, radio column disable */
  public isRowDataCheckedDisabled(rowData: any) {
    return isFunction(this.checkDisablePropField) ? this.checkDisablePropField(rowData) : this.checkDisablePropField ? rowData[this.checkDisablePropField] : false;
  }

  @watchProps(['dataSource', 'treeConfig'])
  watchDataSourceChange() {
    if (this.treeConfig && this.dataSource) {
      this.treeConfig = { ...defaultTreeConfig, ...this.treeConfig };
      this.cacheTreeNodeMap = new Map();
      let allTreeNode: unknown[] = [];
      let result: unknown[] = [];
      let seqNo = 0;
      for (let rowData of this.dataSource) {
        iteratorNodeData(rowData as TreeNodeData, (node: TreeNodeData, parentNode: TreeNodeData) => {
          if (typeof node.close == 'undefined') {
            node.close = true; //默认全部关闭
          }
          allTreeNode.push(node);
          let cache = {
            seqno: seqNo,
            level: this.cacheTreeNodeMap.has(parentNode) ? this.getRowDataTreeLevel(parentNode) + 1 : 0,
            parent: parentNode
          } as TreeNodeCacheType;
          this.cacheTreeNodeMap.set(node, cache);
          seqNo++;
        });
      }
      for (let index = 0, j = allTreeNode.length; index < j; index++) {
        let rowData = allTreeNode[index] as TreeNodeData;
        result.push(rowData);
        if (this.treeConfig && rowData.close) {
          index += getTreeNodeAllChildrenSize(rowData);
        }
      }
      this.innerDataSource = result;
    } else {
      this.innerDataSource = this.dataSource;
    }
    this.cacheExpandLazyLoadDataMap.clear();
  }

  private _renderRowDataBetween(start: number, end: number) {
    const table = this;
    const rowList: unknown[] = [];
    const dataSource = this.innerDataSource;
    const cellTdArray = this.tdRenderColumns;
    // const items=dataSource.slice(start,end);
    for (let i = start, j = end; i < j; i++) {
      let index = i;
      //行循环
      let rowData = dataSource[index] as TreeNodeData;
      const rowContext: RowContext = {
        rowData,
        rowIndex: index
      };
      if (table.treeConfig) {
        rowContext.level = this.getRowDataTreeLevel(rowData);
        rowContext.parentData = this.getRowDataParentData(rowData);
        rowContext.rowIndex = this.getRowDataDataIndex(rowData);
      }

      const rowHtml = [];
      for (let x = 0, y = cellTdArray.length; x < y; x++) {
        //TD循环
        const column = cellTdArray[x];
        const cellContext: CellContext = {
          ...rowContext,
          column: column,
          colIndex: x
        };
        const tdResult = renderTdCellTemplate(cellContext, table);
        if (tdResult != nothing && tdResult != null && tdResult != undefined) {
          rowHtml.push(tdResult);
        }
      }
      const trStyle = this.customRenderRowStyle ? this.customRenderRowStyle(rowContext) : {};
      const trClassInfo = this.customRenderRowClassMap ? this.customRenderRowClassMap(rowContext) : null;
      let trClassObject: any = {};
      if (trClassInfo) {
        if (Array.isArray(trClassInfo)) {
          trClassInfo.forEach(item => (item.trim() != '' ? (trClassObject[item.trim()] = true) : ''));
        } else if (typeof trClassInfo == 'string') {
          trClassInfo.split(' ').forEach(item => (item.trim() != '' ? (trClassObject[item.trim()] = true) : ''));
        } else {
          trClassObject = { ...trClassInfo };
        }
      }
      const rowSpreadResult = this.customRenderRowSpread ? this.customRenderRowSpread(rowContext) : undefined;
      const expandRowTemplate = this.expandRowRender != undefined && this.expandRowData.includes(rowData) ? this.expandRowRender(rowContext, cellTdArray, this.cacheExpandLazyLoadDataMap.get(rowData)) : nothing;

      rowList.push(
        html`<tr
            ${ref(el => {
              setRowContext(el as HTMLTableRowElement, rowContext);
            })}
            .rowData=${rowData}
            style=${styleMap(trStyle)}
            class=${classMap(trClassObject)}
            ${spread(rowSpreadResult)}
          >
            ${rowHtml}
          </tr>
          ${expandRowTemplate}`
      );
    }
    // return html`${repeat(dataSource.slice(start, end), (rowData) => getRowDataKey(rowData), (_rowData, index) => rowList[index])}`
    return rowList;
  }
  /** get row context */
  public getRowContext(row: HTMLTableRowElement) {
    return getRowContext(row);
  }
  /** get td context  */
  public getCellContext(td: HTMLTableCellElement) {
    return getCellContext(td);
  }
  /** get thead th context  */
  public getHeadCellContext(th: HTMLTableCellElement) {
    return getTableHeadCellContext(th);
  }
  private _virtualRenderTbodyRows() {
    if (this.enableVirtualScroll && this.scrollDiv) {
      if (!this.virtualItemHeight) {
        console.error('virtualItem height should be set ');
      }
      let tdRenderColumns = this.tdRenderColumns;
      let scrollTop = this.scrollDiv.scrollTop;
      let height = this.thead.offsetHeight + (this.table.tFoot ? this.table.tFoot.offsetHeight : 0);
      const result = vituralScrollCalc(this.scrollDiv.clientHeight - height, this.innerDataSource.length, this.virtualItemHeight, scrollTop);
      if (result.offsetStart == 0 && result.offsetEnd == 0 && this.innerDataSource.length > 0) {
        this.updateComplete.then(() => {
          this.requestUpdate();
        });
      }
      const trTop = html`<tr>
        <td style=${result.paddingTop > 0 ? `height:${result.paddingTop}px;` : 'display:none'} colspan=${tdRenderColumns.length}>&nbsp;</td>
      </tr>`;
      const trBottom = html`<tr>
        <td style=${result.paddingBottom > 0 ? `height:${result.paddingBottom}px;` : 'display:none'} colspan=${tdRenderColumns.length}>&nbsp;</td>
      </tr>`;
      const trs = this._renderRowDataBetween(result.offsetStart, result.offsetEnd);
      return html`${trTop}${trs}${trBottom}`;
    }
    return '';
  }
  private _renderDataSourceRows() {
    if (this.innerDataSource) {
      return this.enableVirtualScroll && this.innerDataSource.length > 20 ? this._virtualRenderTbodyRows() : this._renderRowDataBetween(0, this.innerDataSource.length);
    }
    return nothing;
  }
  get allSubColumns(): SlColumn[] {
    let columns = Array.from(this.children).filter((item: Element) => {
      return item instanceof SlColumn;
    }) as SlColumn[];
    return columns.sort((item1, item2) => item1.order - item2.order);
  }

  get canShowColumns(): SlColumn[] {
    let columns = Array.from(this.children).filter((item: Element) => {
      return item instanceof SlColumn && !item.hidden;
    }) as SlColumn[];
    return columns.sort((item1, item2) => item1.order - item2.order);
  }

  /** The real data of the header, how many rows are there, and each th has rowspan, colspan */
  @state()
  private theadRows: RowHeader = [];
  /** Loop data, output the header definition array of tbody */
  @state()
  private tdRenderColumns: SlColumn[] = [];
  private isColumnHanlderFlag = true;
  /** If the column changes, the header layout needs to be recalculated */
  public columnChangeHanlder() {
    if (this.hasUpdated && this.scrollDiv && this.isColumnHanlderFlag) {
      this.isColumnHanlderFlag = false;
      Promise.resolve().then(() => {
        const { rows, leafColumns } = caculateColumnData(this.canShowColumns);
        this.theadRows = rows;
        this.tdRenderColumns = leafColumns;
        this.isColumnHanlderFlag = true;
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-table': SlTable;
  }
}
