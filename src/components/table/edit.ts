import { html, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { emit } from '../../internal/event';
import { isArray, isFunction } from '../../utilities/common';
import { getLocal } from '../../utilities/getResouce';
import SlCheckbox from '../checkbox/checkbox';
import '../checkbox/checkbox';
import '../input/input';
import '../select/select';
import SlTable from './table';
import { CellContext, ColumnItems } from './tableConfig';
import { getFieldValue, setFieldValue } from './tableHelper';

/**
 * column 内置的关键单元格编辑器
 */
export enum EDIT_TYPE {
  /** input 输入  */
  INPUT = 'input',
  /** text 输入 */
  TEXT = 'text',
  /** 日期输入 */
  DATE = 'date',
  /** select 输入 */
  SELECT = 'select',
  /** 多选 select  */
  MULIT_SELECT = 'multi-select',
  /** 多选 checkbox */
  MULIT_CHECKBOX = 'multi-checkbox'
}
const defaultEditMap = new Map<string, (context: CellContext) => TemplateResult<1>>();

/**
 * 注册默认单元格编辑器 Editor
 * @param editKey 编辑器类型
 * @param editTemplate  编辑器实现
 */
export const registDefaultEditor = (editKey: string, editTemplate: (context: CellContext) => TemplateResult<1>) => {
  defaultEditMap.set(editKey, editTemplate);
};
export const getSelectLable = (item: ColumnItems) => {
  let locale = getLocal();
  if (locale == 'zh') {
    return item.name;
  } else if (locale == 'en') {
    return item.nameEn || item.name1 || item.name;
  } else {
    return item[`name${locale}`] || item.name;
  }
};
const itemsWeachCache = new WeakMap<Array<ColumnItems>, Map<string | number, ColumnItems>>();

export const findItemLable = (items: Array<ColumnItems>, fieldValue: string | number | Array<string | number>) => {
  if (!itemsWeachCache.has(items)) {
    const itemsMap = new Map<string | number, ColumnItems>();
    for (let item of items) {
      itemsMap.set(item.id, item);
    }
    itemsWeachCache.set(items, itemsMap);
  }
  const map = itemsWeachCache.get(items) as Map<string | number, ColumnItems>;
  let result = [];
  if (isArray(fieldValue)) {
    for (let s of fieldValue) {
      let item = map.get(s);
      if (item) {
        result.push(getSelectLable(item));
      }
    }
  } else {
    let item = map.get(fieldValue);
    if (item) {
      result.push(getSelectLable(item));
    }
  }
  return result.join(',');
};

registDefaultEditor(EDIT_TYPE.INPUT, context => {
  const column = context.column;
  const rowData = context.rowData;
  let value = getFieldValue(rowData, column.field);
  if (value == undefined || value == null) {
    value = '';
  }
  return html`<sl-input
    size="small"
    class="edit_${EDIT_TYPE.INPUT} edit_field_${column.field}"
    .maxlength=${column.inputMaxLength}
    .value=${live(String(value))}
    @sl-input=${(event: Event) => {
      column.field ? setFieldValue(rowData, column.field, (event.target as any).value) : '';
      emitTableCellEditFun(context, event.target as EventTarget, (event.target as any).value);
    }}
  >
  </sl-input>`;
});

registDefaultEditor(EDIT_TYPE.TEXT, context => {
  const column = context.column;
  const rowData = context.rowData;
  let value = getFieldValue(rowData, column.field);
  if (value == undefined || value == null) {
    value = '';
  }
  return html`<sl-textarea
    class="edit_${EDIT_TYPE.TEXT} edit_field_${column.field}"
    .maxlength=${column.inputMaxLength}
    .value=${live(String(value))}
    @sl-input=${(event: Event) => {
      column.field ? setFieldValue(rowData, column.field, (event.target as any).value) : '';
      emitTableCellEditFun(context, event.target as EventTarget, (event.target as any).value);
    }}
  >
  </sl-textarea>`;
});
/** 触发sl-table-edit-cell 事件 */
export const emitTableCellEditFun = (context: CellContext, dom: EventTarget, value: any) => {
  const table = context.column.table;
  emit(table, 'sl-table-cell-edit-commit', {
    detail: {
      td: (dom as HTMLElement).closest('td'),
      dom: dom,
      value: value,
      context
    }
  });
};

registDefaultEditor(EDIT_TYPE.SELECT, context => {
  const column = context.column;
  const rowData = context.rowData;
  let value = getFieldValue(rowData, column.field);
  if (value == undefined || value == null) {
    value = '';
  }
  return html`<sl-select
    size="small"
    hoist
    class="edit_${EDIT_TYPE.SELECT} edit_field_${column.field}"
    @sl-change=${(event: Event) => {
      if (column.field) {
        setFieldValue(rowData, column.field, (event.target as any).value);
      }
      emitTableCellEditFun(context, event.target as EventTarget, (event.target as any).value);
    }}
    .value=${live(value)}
  >
    ${column.items ? column.items.map(item => html`<sl-menu-item .value=${item.id}>${getSelectLable(item)}</sl-menu-item>`) : ''}
  </sl-select>`;
});

registDefaultEditor(EDIT_TYPE.MULIT_SELECT, context => {
  const column = context.column;
  const rowData = context.rowData;
  let array = getFieldValue(rowData, column.field);
  if (!isArray(array)) {
    array = [];
  }
  return html`<sl-select
    size="small"
    multiple
    clearable
    hoist
    class="edit_${EDIT_TYPE.MULIT_SELECT} edit_field_${column.field}"
    .value=${live(array)}
    @sl-change=${(event: Event) => {
      if (column.field) {
        array = (event.target as any).value;
        setFieldValue(rowData, column.field, array);
      }
      emitTableCellEditFun(context, event.target as EventTarget, (event.target as any).value);
    }}
  >
    ${column.items ? column.items.map(item => html`<sl-menu-item .value=${live(item.id)}>${getSelectLable(item)}</sl-menu-item>`) : ''}
  </sl-select>`;
});

registDefaultEditor(EDIT_TYPE.MULIT_CHECKBOX, context => {
  const column = context.column;
  const rowData = context.rowData;
  let array = getFieldValue(rowData, column.field);
  if (!isArray(array)) {
    array = [];
  }
  const refObj = createRef();
  return html`<div
    ${ref(refObj)}
    multiple
    hoist
    class="edit_${EDIT_TYPE.MULIT_CHECKBOX} edit_field_${column.field}"
    @sl-change=${(event: Event) => {
      let new_array: (string | number)[] = [];
      let checkbox = (refObj.value as HTMLElement).querySelectorAll('sl-checkbox') as NodeListOf<SlCheckbox>;
      checkbox.forEach(item => {
        if (item.checked) {
          new_array.push(item.value);
        }
      });
      if (column.field) {
        setFieldValue(rowData, column.field, new_array);
      }
      emitTableCellEditFun(context, event.target as EventTarget, new_array);
    }}
  >
    ${column.items ? column.items.map(item => html`<sl-checkbox .checked=${live(array.includes(item.id))} .value=${item.id}>${getSelectLable(item)}</sl-checkbox>`) : ''}
  </div>`;
});

registDefaultEditor(EDIT_TYPE.DATE, context => {
  const column = context.column;
  const rowData = context.rowData;
  let value = getFieldValue(rowData, column.field);
  if (value == undefined || value == null) {
    value = '';
  }
  // style='max-width: var(--sl-column-width-${column.field})'
  const mode = column.type == 'date-month' ? 'month' : column.type == 'date-year' ? 'year' : 'date';
  return html`<div>
    <sl-date
      block
      size="small"
      .mode=${mode}
      class="edit_date edit_field_${column.field}"
      .value=${live(value)}
      @sl-date-change=${(event: Event) => {
        column.field ? setFieldValue(rowData, column.field, (event.target as any).value) : '';
        emitTableCellEditFun(context, event.target as EventTarget, (event.target as any).value);
      }}
    >
    </sl-date>
  </div>`;
});
/** 常量，表明 此单元格 不变成编辑模式 */
export const editNone = {};
/**
 * 获取TD 的编辑器
 * @param context
 * @returns
 */
export const getCellEditor = (context: CellContext): typeof editNone | TemplateResult<1> => {
  const column = context.column;
  if (column.edit) {
    if (isFunction(column.edit)) {
      return (column.edit as Function)(context);
    } else {
      const editTemplate = defaultEditMap.get(column.edit as string);
      return editTemplate ? editTemplate(context) : editNone;
    }
  }
  return editNone;
};
/**
 * 判断当前 单元格是否是编辑状态
 * @param context
 * @param table
 * @returns
 */
export const isCellEditor = (context: CellContext, table: SlTable) => {
  if (table.editEnable) {
    if (table.editMode == 'row' && table.currentEditRow && table.currentEditRow.includes(context.rowData)) {
      return true;
    } else if (table.editMode == 'column' && table.currentEditColumn && table.currentEditColumn.includes(context.column)) {
      return true;
    } else if (table.editMode == 'cell' && table.currentEditCell && table.currentEditCell.column == context.column && table.currentEditCell.rowData == context.rowData) {
      return true;
    }
  }
  return false;
};
