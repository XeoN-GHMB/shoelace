import { html, TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import { emit } from '../../internal/event';
import { isArray } from '../../utilities/common';
import SlCheckbox from '../checkbox/checkbox';
import SlColumn from '../column/column';
import { iteratorNodeData, TreeNodeData } from '../tree-node/tree-node-util';
import SlTable from './table';
import { CellContext, CellHeadContext } from './tableConfig';

const defaultColMap = new Map<string, (column: SlColumn, table: SlTable) => TemplateResult<1>>();
/**
 * 注册Table 列TH 默认渲染
 * @param type  列的类型
 * @param templateFun 渲染Template ，函数接收两个参数，一个是column, 一个table对象
 */
export const registerColTemplate = (type: string, templateFun: (column: SlColumn, table: SlTable) => TemplateResult<1>) => {
  defaultColMap.set(type, templateFun);
};
export const getReisterColTemplate = (type: string) => {
  return defaultColMap.get(type);
};
export const checkboxColChange = (table: SlTable, checkbox: SlCheckbox) => {
  const head_before = emit(table, 'sl-table-check-head-before-change', {
    cancelable: true,
    detail: {
      checkbox: checkbox
    }
  });
  if (head_before.defaultPrevented) {
    return;
  }
  const checked = checkbox.checked;
  let array: any[] = [];
  if (checked) {
    const doTreeNode = (nodeData: any) => {
      const isdisabled = table.isRowDataCheckedDisabled(nodeData);
      if (isdisabled) {
        return;
      }
      const checkedValue = table.getRowDataCheckValue(nodeData);
      array.push(checkedValue);
    };

    const dataSource = table.dataSource;
    if (table.treeConfig) {
      for (let d of dataSource) {
        iteratorNodeData(d as TreeNodeData, doTreeNode);
      }
    } else {
      for (let d of dataSource) {
        doTreeNode(d);
      }
    }
  }
  table.checkValue = array;
  emit(table, 'sl-table-check-change', {
    detail: {
      checkbox: checkbox,
      value: table.checkValue
    }
  });
};
registerColTemplate('checkbox', (_column, table) => {
  const dataSource = table.getRenderDataSource();
  const checkAll = dataSource && isArray(table.checkValue) ? (table.checkValue as Array<any>).length == dataSource.length : false;
  const indeterminate = !checkAll && isArray(table.checkValue) ? (table.checkValue as Array<any>).length > 0 : table.checkValue != undefined;
  return html`<sl-checkbox class="table-check" .checked=${checkAll} .indeterminate=${indeterminate} @sl-change=${(event: Event) => checkboxColChange(table, event.target as SlCheckbox)}></sl-checkbox>`;
});

export const getColumnRenderResult = (context: CellHeadContext, table: SlTable) => {
  const column = context.column;
  if (column.renderCol) {
    return html`${column.renderCol(context)}`;
  }
  let templateFun = getReisterColTemplate(column.type);
  if (templateFun) {
    return templateFun(column, table);
  } else {
    return html`${column.label}`;
  }
};

const defaultCellMap = new Map<string, (context: CellContext, table: SlTable) => TemplateResult<1>>();
/**
 * 注册Table 列TD默认渲染
 * @param type  列的类型
 * @param templateFun  渲染Template ，函数接收两个参数，cellContext, 一个table对象
 */
export const registerCellTemplate = (type: string, templateFun: (context: CellContext, table: SlTable) => TemplateResult<1>) => {
  defaultCellMap.set(type, templateFun);
};
export const checkboxTDChange = (checkbox: SlCheckbox, table: SlTable) => {
  let checked = checkbox.checked;
  let td = checkbox.closest('td') as HTMLTableCellElement;
  const context = table.getCellContext(td);
  const rowData = context.rowData;
  const isArray = table.checkValue;
  const checkedValue = table.getRowDataCheckValue(rowData);
  let array = isArray ? [...table.checkValue] : table.checkValue ? [table.checkValue] : [];
  let index = array.indexOf(checkedValue);
  if (checked && index == -1) {
    array.push(checkedValue);
  } else if (!checked) {
    array.splice(index, 1);
  }
  const doTreeNode = (nodeData: any) => {
    const isdisabled = table.isRowDataCheckedDisabled(nodeData);
    if (isdisabled) {
      return;
    }
    const checkedValue = table.getRowDataCheckValue(nodeData);
    let d_index = array.indexOf(checkedValue);
    if (checked && d_index == -1) {
      array.push(checkedValue);
    } else if (!checked) {
      d_index >= 0 ? array.splice(d_index, 1) : null;
    }
  };
  if (table.treeConfig) {
    if (table.checkTreeCasecadeUp) {
      let parentData = table.getRowDataParentData(rowData);
      while (parentData) {
        doTreeNode(parentData);
        parentData = table.getRowDataParentData(parentData);
      }
    }
    if (table.checkTreeCasecadeDown) {
      let sub = rowData.children as Array<TreeNodeData>;
      const iteratorFun = (sub?: Array<TreeNodeData>) => {
        if (!sub) {
          return;
        }
        for (let d of sub) {
          iteratorNodeData(d, doTreeNode);
        }
      };
      iteratorFun(sub);
    }
  }

  table.checkValue = array;
  emit(table, 'sl-table-check-change', {
    detail: {
      checkbox: checkbox,
      value: table.checkValue
    }
  });
};
registerCellTemplate('checkbox', (context, table) => {
  const rowData = context.rowData;
  const ischecked = table.isRowDataChecked(rowData);
  const isdisabled = table.isRowDataCheckedDisabled(rowData);
  return html`<sl-checkbox
    class="table-check"
    @sl-before-change=${(event: Event) => {
      const el = event.target as SlCheckbox;
      emit(table, 'sl-table-check-before-change', {
        cancelable: true,
        detail: {
          checkbox: el,
          ...context
        }
      });
    }}
    .checked=${live(ischecked)}
    .disabled=${isdisabled}
    @sl-change=${(event: Event) => checkboxTDChange(event.target as SlCheckbox, table)}
  ></sl-checkbox>`;
});

registerCellTemplate('radio', (context, table) => {
  const rowData = context.rowData;
  const checkValue = table.getRowDataCheckValue(rowData);
  const ischecked = table.isRowDataRadioChecked(rowData);
  const isdisabled = table.isRowDataCheckedDisabled(rowData);
  return html`<sl-radio
    class="table-check"
    .checked=${live(ischecked)}
    .disabled=${isdisabled}
    @sl-change=${(_event: Event) => {
      table.radioValue = checkValue;
      emit(table, 'sl-table-radio-change', {
        detail: {
          value: checkValue,
          context: context
        }
      });
    }}
  ></sl-radio>`;
});

/**注册 index列逻辑 */
registerCellTemplate('index', (context, _table) => {
  const rowIndex = context.rowIndex;
  return html`${rowIndex + 1}`;
});

export const getReisterCellTemplate = (type: string) => {
  return defaultCellMap.get(type);
};
