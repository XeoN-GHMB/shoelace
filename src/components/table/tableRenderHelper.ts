import { html, nothing, svg, TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import { spread } from '../../internal/spread';
import { isFunction } from '../../utilities/common';
import { getColumnRenderResult, getReisterCellTemplate } from './cellDefaultRender';
import { editNone, findItemLable, getCellEditor, isCellEditor } from './edit';
import { renderSortHeaderTemplate, sortRenderHanlder } from './sort';
import SlTable from './table';
import { CellContext, CellHeadContext, SortTrigger } from './tableConfig';
import { getFieldValue, isNumberWidth } from './tableHelper';
const cellHeadContextMap = new WeakMap<HTMLTableCellElement, CellHeadContext>();
const setHeadCellContext = (el: HTMLTableCellElement, context: CellHeadContext) => {
  if (el) {
    cellHeadContextMap.set(el, context);
  }
};

/** 获取 td 上下文 */
export const getTableHeadCellContext = (el: HTMLTableCellElement) => {
  return cellHeadContextMap.get(el) as CellHeadContext;
};
export const renderThColTemplate = (context: CellHeadContext, table: SlTable) => {
  let styleObject: any = {};
  const column = context.column;
  if (context.colspan == 1) {
    if (column.width) {
      const isNumber = isNumberWidth(column.width);
      styleObject['width'] = column.width + (isNumber ? 'px' : '');
      if (!column.minWidth) {
        styleObject['min-width'] = styleObject['width'];
      }
    }
    if (column.minWidth) {
      const isNumber = isNumberWidth(column.minWidth);
      styleObject['min-width'] = column.minWidth + (isNumber ? 'px' : '');
    }

    if (column.maxWidth) {
      const isNumber = isNumberWidth(column.maxWidth);
      styleObject['max-width'] = column.maxWidth + (isNumber ? 'px' : '');
    }
  }
  const styleInfo = table.customRenderCellHeadStyle ? table.customRenderCellHeadStyle(context) : null;
  if (styleInfo) {
    if (typeof styleInfo == 'object') {
      styleObject = { ...styleObject, ...styleInfo };
    }
  }
  let classInfo = table.customRenderCellHeadClassMap ? table.customRenderCellHeadClassMap(context) : null;
  let classObj: any = {};
  if (classInfo != null) {
    if (Array.isArray(classInfo)) {
      classInfo.forEach(item => (item.trim() != '' ? (classObj[item.trim()] = true) : ''));
    } else if (typeof classInfo == 'string') {
      classInfo.split(' ').forEach(item => (item.trim() != '' ? (classObj[item.trim()] = true) : ''));
    } else {
      classObj = { ...classInfo };
    }
  }
  if (table.sortConfig && table.sortConfig.trigger == SortTrigger.cell && column.sortAble) {
    classObj['cursor'] = true;
  }
  const trigger = table.sortConfig.trigger;
  const headResult = table.customRenderCellHeadSpread ? table.customRenderCellHeadSpread(context) : undefined;
  const handerSort = (_event: Event) => {
    if (trigger == SortTrigger.self) {
      sortRenderHanlder(column, table);
    }
  };
  const handerTHSort = (_event: Event) => {
    if (headResult && headResult['@click']) {
      try {
        if (isFunction(headResult['@click'])) {
          headResult['@click'](_event);
        } else {
          (headResult['@click'] as EventListenerObject).handleEvent(_event);
        }
      } catch (ex) {
        console.error(ex);
      }
    }
    if (trigger == SortTrigger.cell) {
      sortRenderHanlder(column, table);
    }
  };

  return html`<th
    uniqueID=${column.uniqueID}
    .column=${column}
    field=${ifDefined(column.field)}
    .vAlign=${column.colvAlign}
    .align=${column.colAlign}
    @click=${handerTHSort}
    class=${classMap(classObj)}
    style=${styleMap(styleObject)}
    colIndex=${(context.colIndex as number) + ''}
    .rowSpan=${context.rowspan as number}
    .colSpan=${context.colspan as number}
    ${ref(el => setHeadCellContext(el as HTMLTableCellElement, context))}
    ${spread(headResult)}
  >
    <div class="thWrap">
      <span class="column-title ${column.sortAble ? 'sort-able' : ''}">${getColumnRenderResult(context, table)}</span>
      ${renderSortHeaderTemplate(table, column, handerSort)} ${column.resizeAble ? html`<div part="resize-hanler" @click=${stopHanderClick} class="th-resize-helper"></div>` : ''}
    </div>
  </th>`;
};
const stopHanderClick = (event: Event) => {
  event.stopPropagation();
};
export const getColumnCellRenderTemplate = (context: CellContext, table: SlTable) => {
  const column = context.column;
  if (column.renderCell) {
    return column.renderCell(context);
  }
  let templateFun = getReisterCellTemplate(column.type);
  if (templateFun) {
    return templateFun(context, table);
  } else {
    return cellDataRenderResult(context) as TemplateResult<1>;
  }
};
const cellDataRenderResult = (context: CellContext) => {
  const col = context.column;
  let colResult: TemplateResult<1>;
  let fieldValue = getFieldValue(context.rowData, col.field);
  if (fieldValue == undefined || fieldValue == null) {
    fieldValue = '';
  }
  if (col.items) {
    fieldValue = findItemLable(col.items, fieldValue);
  }
  colResult = html`${fieldValue}`;
  return colResult;
};
const cellContextMap = new WeakMap<HTMLTableCellElement, CellContext>();
const setCellContext = (el: HTMLTableCellElement, context: CellContext) => {
  if (el) {
    cellContextMap.set(el, context);
  }
};
/** 获取 td 上下文 */
export const getCellContext = (el: HTMLTableCellElement) => {
  return cellContextMap.get(el) as CellContext;
};

export const renderTdCellTemplate = (context: CellContext, table: SlTable) => {
  const column = context.column;
  let tdResult = getColumnCellRenderTemplate(context, table) as any;
  if (tdResult == undefined || tdResult == nothing || tdResult.rowspan == 0 || tdResult.colspan == 0) {
    return nothing; //标识此td 不进行渲染
  } else {
    const isEditFlag = isCellEditor(context, table);
    if (isEditFlag) {
      const editTemplate = getCellEditor(context);
      if (editTemplate != editNone) {
        tdResult.template = editTemplate;
      }
    }
    const styleInfo = table.customRenderCellStyle ? table.customRenderCellStyle(context) : {};
    let classInfo = table.customRenderCellClassMap ? table.customRenderCellClassMap(context) : null;
    let classObj: any = {};
    if (classInfo != null) {
      if (Array.isArray(classInfo)) {
        classInfo.forEach(item => (item.trim() != '' ? (classObj[item.trim()] = true) : ''));
      } else if (typeof classInfo == 'string') {
        classInfo.split(' ').forEach(item => (item.trim() != '' ? (classObj[item.trim()] = true) : ''));
      } else {
        classObj = { ...classInfo };
      }
    }
    const tdHtml = html`<div class="tdWrap ${!isEditFlag && table.enableCellBox && column.type != 'checkbox' ? 'cellBox' : ''}">${tdResult.template ? html`${tdResult.template}` : html`${tdResult}`}</div>`;

    const tdSpreadResult = table.customRenderCellSpread ? table.customRenderCellSpread(context) : undefined;
    return html`<td
      ${ref(el => setCellContext(el as HTMLTableCellElement, context))}
      uniqueID=${column.uniqueID}
      field=${column.field}
      .align=${column.align}
      .vAlign=${column.vAlign}
      style=${styleMap(styleInfo)}
      class=${classMap(classObj)}
      colspan=${tdResult.colspan ? tdResult.colspan : 1}
      rowspan=${tdResult.rowspan ? tdResult.rowspan : 1}
      ${spread(tdSpreadResult)}
    >
      ${wrapColumnFieldTemplate(context, tdHtml, table)}
    </td>`;
  }
};
const closeNodeSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" id="chevron-right"><path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 011.659-.753l5.48 4.796a1 1 0 010 1.506z"></path></svg>`;
const openNodeSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" id="chevron-down"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"></path></svg>`;
const expendCloseSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"  viewBox="0 0 16 16" id="chevron-right"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z"></path></svg>`;
const expendOpendSvg = svg`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" id="chevron-down"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"></path></svg>`;

export const TABLESVG = {
  closeNodeSvg,
  openNodeSvg,
  expendCloseSvg,
  expendOpendSvg
};
/**
 * 内部使用封装td 渲染的数据，实现特殊功能
 * @param column
 * @param rowData
 * @param wrap
 * @returns
 */
const wrapColumnFieldTemplate = (context: CellContext, wrap: TemplateResult<1>, table: SlTable) => {
  const column = context.column;
  const rowData = context.rowData;
  if (column.field && table.treeConfig && column.field == table.treeConfig.treeNodeColumn) {
    let level = context.level || 0;
    if (typeof rowData.close == 'undefined') {
      rowData.close = true;
    }
    let closed = rowData.close;
    let span = html`<span class="tree-node-icon" componentID=${table.componentID} part="tree-node-toogle"
      >${table.treeLoadingNode.includes(rowData) ? html`<sl-spinner part="tree-node-loading"></sl-spinner>` : closed ? TABLESVG.closeNodeSvg : TABLESVG.openNodeSvg}
    </span>`;
    return html`<div part="tree-node" class="tree-node ${table.treeNodeNoWrap ? 'nowrap-tree-node' : ''} ${closed ? 'closed' : ''}">
      <div class="tree-node-inner" style="padding-left:${level * (table.treeConfig.indent as number)}px;">
        ${table.treeNodeHasChildren(rowData) ? span : html`<span class="tree-node-empty-node"></span>`} ${rowData.icon ? html`<sl-icon class="tree-node-icon" name=${rowData.icon}></sl-icon>` : ''} ${wrap}
      </div>
    </div>`;
  } else if (column.field && table.expandColumn && column.field == table.expandColumn) {
    const opened = table.expandRowData.includes(rowData);
    return html`<div class="expand-toogle" part="expand-wrap">
      <span class="expand-toogle-icon" componentID=${column.table.componentID} part="expand-toogle-icon">
        ${table.expandingRowData.includes(rowData) ? html`<sl-spinner part="expand-loading"></sl-spinner>` : opened ? TABLESVG.expendOpendSvg : TABLESVG.expendCloseSvg}
      </span>
      ${wrap}
    </div>`;
  }
  return wrap;
};
