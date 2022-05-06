import { emit } from '../../internal/event';
import { debounce, throttleTimeout } from '../../internal/throttle';
import { addEvent, getCssValue, onEvent, onEventArray } from '../../utilities/common';
import { dragOnHandler } from '../../utilities/dragHelper';
import SlColumn from '../column/column';
import { iteratorNodeData, TreeNodeData } from '../tree-node/tree-node-util';
import { editNone } from './edit';
import SlTable, { getRowContext } from './table';
import { saveAsDefaultTableCache, updateTableCache } from './tableCacheHelper';
import { getCellContext } from './tableRenderHelper';

export const getTreeNodeAllChildrenSize = (rowData: TreeNodeData) => {
  let size = 0;
  iteratorNodeData(rowData, (_node, _parent) => {
    size++;
  });
  return size - 1;
};

/**Table 树 TreeNode Toogle,open close事件 */
const handlerNodeToogleListener = (table: SlTable) => {
  let tableEl = table.table;
  return onEvent(tableEl, `tbody[componentID=${table.componentID}]>tr>td>div[part=tree-node] span.tree-node-icon[part=tree-node-toogle][componentID=${table.componentID}]`, 'click', (event: Event) => {
    const el = event.delegateTarget;
    let td = el.closest('td') as HTMLTableCellElement;
    while (td && td.closest('table') != table.table) {
      td = (td.parentElement as HTMLElement).closest('td') as HTMLTableCellElement;
    }
    const cellContext = getCellContext(td);
    const rowData = cellContext.rowData;
    if (typeof rowData.children == 'undefined' && table.treeConfig && table.treeConfig.lazy) {
      if (!table.treeLoadingNodeMethod) {
        console.warn('lazy 模式下应该设置 加载方法：loadingNodeMethod');
        return;
      }
      table.treeLoadingNode.push(rowData);
      table.treeLoadingNode = [...table.treeLoadingNode];
      Promise.resolve().then(async () => {
        try {
          let result = await table.treeLoadingNodeMethod(cellContext);
          if (result) {
            rowData.children = result;
          }
          rowData.close = false;
          let index = table.treeLoadingNode.indexOf(rowData);
          if (index >= 0) {
            table.treeLoadingNode.splice(index, 1);
          }
          const isScrollEnd = table.scrollDiv.scrollTop == table.scrollDiv.scrollHeight - table.scrollDiv.offsetHeight;
          if (isScrollEnd) {
            //如果是最下面的位置，此时必须要调整下scrollTop 的位置，否则，会显示底部空白
            table.scrollDiv.scrollTop = table.scrollDiv.scrollTop - 1;
          }
          table.watchDataSourceChange();
          emit(table, 'sl-tree-node-loaded', {
            detail: {
              dom: event.target,
              result: result,
              context: cellContext
            }
          });
        } catch (ex) {
          console.error(ex);
          table.treeLoadingNode.splice(table.treeLoadingNode.indexOf(rowData), 1);
          table.treeLoadingNode = [...table.treeLoadingNode];
          emit(table, 'sl-tree-node-load-error', {
            detail: {
              dom: event.target,
              error: ex,
              context: cellContext
            }
          });
        }
      });
      return;
    }
    const nodeEvent = emit(table, `sl-tree-node-before-${rowData.close ? 'open' : 'close'}`, {
      cancelable: true,
      detail: {
        dom: event.target,
        context: cellContext
      }
    });
    const nodeToogleEvent = emit(table, `sl-tree-node-toogle`, {
      cancelable: true,
      detail: {
        dom: event.target,
        context: cellContext
      }
    });
    if (!nodeEvent.defaultPrevented && !nodeToogleEvent.defaultPrevented) {
      rowData.close = !rowData.close;
      table.watchDataSourceChange();
      table.updateComplete.then(() => {
        emit(table, `sl-tree-node-${rowData.close ? 'close' : 'open'}`, {
          detail: {
            dom: event.target,
            context: cellContext
          }
        });
        emit(table, `sl-tree-node-toogle`, {
          detail: {
            dom: event.target,
            context: cellContext
          }
        });
      });
    }
  });
};
const lastEditCellSymbol = Symbol('lastEditCell'); //属性，存储table 上次编辑的TD
const lastEditSymboPromise = Symbol('lastEditPromise'); //属性，存储table 上次编辑的Promise
const getLastEditCell = (table: SlTable) => {
  return (table as any)[lastEditCellSymbol];
};
const setLastEditCell = (table: SlTable, lastEditCell: HTMLTableCellElement) => {
  return ((table as any)[lastEditCellSymbol] = lastEditCell);
};
const TABLE_EDIT_SELECTS = 'input,select,textarea,sl-input,sl-select,sl-date';
const processTDCellEdit = (td: HTMLTableCellElement, table: SlTable, event: Event) => {
  const tr = td.parentElement as HTMLTableRowElement;
  processEdit();
  function processEdit() {
    const rowContext = getRowContext(tr);
    const cellContext = getCellContext(td);
    if (!cellContext || !cellContext.column) {
      return;
    }
    const edit = cellContext.column.edit;
    if (edit == editNone || !edit) {
      return;
    }
    let lastEditCell = getLastEditCell(table);
    if (lastEditCell && lastEditCell != td) {
      /** 监听编辑的单元格改变 */
      const eventEmit = emit(table, 'sl-cell-edit-before-change', {
        cancelable: true,
        detail: {
          td: lastEditCell,
          context: getCellContext(lastEditCell)
        }
      });
      if (!eventEmit.defaultPrevented) {
        editCellFun();
      }
    } else {
      editCellFun();
    }
    function editCellFun() {
      if (event.type == 'contextmenu') {
        event.preventDefault();
      }
      //监听当前TD 进入edit 前
      const eventEmit = emit(table, 'sl-cell-edit-start', {
        cancelable: true,
        detail: {
          td: td,
          context: getCellContext(td)
        }
      });
      if (eventEmit.defaultPrevented) {
        return;
      }

      if ((table as any)[lastEditSymboPromise]) {
        return;
      }
      (table as any)[lastEditSymboPromise] = true;
      Promise.resolve().then(() => {
        if (table.editMode == 'row') {
          if (!(table.currentEditRow && table.currentEditRow.includes(rowContext.rowData))) {
            if (table.editAccordion) {
              table.currentEditRow = [rowContext.rowData];
            } else {
              if (!table.currentEditRow) {
                table.currentEditRow = [];
              }
              table.currentEditRow.push(rowContext.rowData);
            }
          }
        } else if (table.editMode == 'column') {
          if (!(table.currentEditColumn && table.currentEditColumn.includes(cellContext.column))) {
            if (table.editAccordion) {
              table.currentEditColumn = [cellContext.column];
            } else {
              if (!table.currentEditColumn) {
                table.currentEditColumn = [];
              }
              table.currentEditColumn.push(cellContext.column);
            }
          }
        } else if (table.editMode == 'cell') {
          table.currentEditCell = {
            rowData: rowContext.rowData,
            column: cellContext.column
          };
        }
        table.requestUpdate();
        table.updateComplete.then(() => {
          (table as any)[lastEditSymboPromise] = false;
          let editor = td.querySelector(TABLE_EDIT_SELECTS) as HTMLElement;
          editor?.focus();
          if (td != getLastEditCell(table)) {
            /** 监听当前进入了编辑状态的单元格 */
            emit(table, 'sl-cell-edit-active', {
              detail: {
                td: td,
                context: cellContext
              }
            });
            setLastEditCell(table, td);
          }
        });
      });
    }
  }
};
/** tbody 代理的事件 */
export const TABLE_TBODY_DELEGATE_EVENTS = ['click', 'dblclick', 'contextmenu', 'keydown', 'keyup', 'keypress', 'mousedown', 'mouseenter', 'mousemove', 'mouseover', 'mouseout'];
/**给Table tr, td 添加事件 */
const hanlderTRTDEvent = (table: SlTable) => {
  const one1 = onEventArray(table.table, `tbody[componentID=${table.componentID}]>tr>td`, TABLE_TBODY_DELEGATE_EVENTS, (event: Event) => {
    let td = event.delegateTarget as HTMLTableCellElement;
    let tr = td.parentElement as HTMLTableRowElement;
    while (td && td.parentElement && td.closest('table') != table.table) {
      td = (td.parentElement as HTMLElement).closest('td') as HTMLTableCellElement;
      tr = td.parentElement as HTMLTableRowElement;
    }
    if (td && table.editEnable && table.editTrigger == event.type) {
      processTDCellEdit(td, table, event);
    }
    td
      ? emit(table, `sl-table-td-${event.type}`, {
          cancelable: true,
          detail: {
            td: td,
            row: tr,
            ...getCellContext(td)
          }
        })
      : '';
  });
  const one2 = onEventArray(table.table, `tbody[componentID=${table.componentID}]>tr`, TABLE_TBODY_DELEGATE_EVENTS, (event: Event) => {
    let tr = event.delegateTarget as HTMLTableRowElement;
    while (tr && tr.parentElement != null && tr.closest('table') != table.table) {
      tr = (tr.parentElement as HTMLElement).closest('tr') as HTMLTableRowElement;
    }
    tr
      ? emit(table, `sl-table-tr-${event.type}`, {
          cancelable: true,
          detail: {
            row: tr,
            ...table.getRowContext(tr)
          }
        })
      : '';
  });
  return {
    dispose() {
      for (let l of one1) {
        l.dispose();
      }
      for (let l of one2) {
        l.dispose();
      }
    }
  };
};
/** 给table 添加拖动表头事件 */
const handerTableResizeEvent = (slTable: SlTable) => {
  let table = slTable.table;
  let debounseUpdate = debounce(function () {
    updateTableCache(slTable);
  }, 60);
  let width = 0;
  let tableWidth = 0;
  let oldWidth = 0;
  let th: HTMLElement;
  let isTableResize = false;
  return dragOnHandler(
    table,
    `thead[componentID=${slTable.componentID}]>tr>th div.th-resize-helper`,
    (changePos, event) => {
      if (isTableResize) {
        return;
      }
      isTableResize = true;
      let div = (event as any).delegateTarget as HTMLElement;
      th = div.closest('th') as HTMLElement;
      while (th && th.closest('table') != slTable.table) {
        th = (th.parentElement as Element).closest('th') as HTMLElement;
      }
      let column = (th as any).column as SlColumn;
      if (!column || column.table != slTable) {
        return;
      }
      saveAsDefaultTableCache(slTable);
      width = parseInt(getCssValue(th, 'width'));
      tableWidth = parseInt(getCssValue(table, 'width'));
      oldWidth = width;
      width += changePos.x;
      if (column.maxWidth) {
        let maxWidth = parseInt(column.maxWidth, 10);
        if (width > maxWidth) {
          width = maxWidth;
        }
      }
      if (column.minWidth) {
        let minWidth = parseInt(column.minWidth, 10);
        if (width < minWidth) {
          width = minWidth;
        }
      }
      column.width = width + '';
      table.style.width = tableWidth + (width - oldWidth) + 'px';
      slTable.updateComplete.then(() => {
        isTableResize = false;
        emit(slTable, 'sl-table-column-resize', {
          detail: {
            column: column,
            oldWidth: oldWidth,
            width: width
          }
        });
      });
    },
    () => {
      if (slTable.cacheKey) {
        debounseUpdate();
      }
    }
  );
};

const handlerTableScroll = (slTable: SlTable) => {
  const tableScrollPromiseFlag = Symbol('table-scroll-promise');
  let scrollDiv = slTable.scrollDiv;
  let scrollTop = scrollDiv.scrollTop;
  let scrollLeft = scrollDiv.scrollLeft;
  let debouceScroll = throttleTimeout(
    () => {
      if (slTable.enableVirtualScroll && slTable.virtualItemHeight) {
        if (scrollDiv.scrollTop != scrollTop || scrollDiv.scrollLeft != scrollLeft) {
          slTable.requestUpdate();
          slTable.updateComplete.then(() => {
            scrollTop = scrollDiv.scrollTop;
            scrollLeft = scrollDiv.scrollLeft;
          });
        }
      }
    },
    60,
    120
  );
  const l1 = addEvent(slTable, 'sl-table-resize', debouceScroll);
  const l2 = addEvent(scrollDiv, 'mousewheel', (_event: WheelEvent) => {
    if (slTable.enableVirtualScroll) {
      _event.preventDefault();
      let y = _event.deltaY;
      let deltaMode = _event.deltaMode;
      if (deltaMode == WheelEvent.DOM_DELTA_PIXEL) {
        scrollDiv.scrollTop += y;
        //scrollDiv.scrollLeft += x;
      } else {
        scrollDiv.scrollTop += y * slTable.virtualItemHeight;
        //scrollDiv.scrollLeft += x;
      }

      if ((slTable as any)[tableScrollPromiseFlag]) {
        return;
      }
      (slTable as any)[tableScrollPromiseFlag] = true;
      Promise.resolve().then(() => {
        debouceScroll();
        (slTable as any)[tableScrollPromiseFlag] = false;
      });
    }
  });
  const l3 = addEvent(scrollDiv, 'scroll', () => {
    emit(slTable, 'sl-table-scroll', {
      detail: {
        div: scrollDiv
      }
    });
    if (slTable.enableVirtualScroll) {
      debouceScroll();
    }
  });
  return {
    dispose() {
      l1.dispose();
      l2.dispose();
      l3.dispose();
    }
  };
};
/** table 扩展行逻辑处理 */
const handlerRowExpandListener = (table: SlTable) => {
  let tableEl = table.table;
  return onEvent(tableEl, `tbody[componentID=${table.componentID}]>tr>td span[part=expand-toogle-icon][componentID=${table.componentID}]`, 'click', (event: Event) => {
    const el = event.delegateTarget as HTMLElement;
    let td = el.closest('td') as HTMLTableCellElement;
    while (td.parentNode && td.closest('table') != tableEl) {
      td = (td.parentNode as HTMLElement).closest('td') as HTMLTableCellElement;
    }
    const tr = td.closest('tr') as HTMLTableRowElement;
    const rowData = (tr as any).rowData;
    if (table.expandLazy) {
      if (!table.cacheExpandLazyLoadDataMap.has(rowData)) {
        if (!table.expandLazyLoadMethod) {
          console.error('expand lazy mode 必须设置加载方法:currentExpandingRowData');
          return;
        }
        if (!table.expandingRowData.includes(rowData)) {
          table.expandingRowData.push(rowData);
        }
        table.expandingRowData = [...table.expandingRowData];
        Promise.resolve().then(async () => {
          try {
            let result = await table.expandLazyLoadMethod(rowData);
            table.cacheExpandLazyLoadDataMap.set(rowData, result);
            if (table.expandAccordion) {
              table.expandRowData.splice(0, table.expandRowData.length);
            }
            if (!table.expandRowData.includes(rowData)) {
              table.expandRowData.push(rowData);
            }
          } catch (ex) {
            emit(table, 'sl-table-expand-load-error', {
              detail: {
                error: ex,
                rowData: rowData
              }
            });
          }
          let indexOf = table.expandingRowData.indexOf(rowData);
          if (indexOf >= 0) {
            table.expandingRowData.splice(indexOf, 1);
          }
          table.expandingRowData = [...table.expandingRowData];
        });
      } else {
        table.doExpandRowData(rowData);
      }
    } else {
      table.doExpandRowData(rowData);
    }
  });
};

export const connectTableHanlder = (table: SlTable) => {
  const array = [hanlderTRTDEvent(table), handerTableResizeEvent(table), handlerNodeToogleListener(table), handlerTableScroll(table), handlerRowExpandListener(table)];

  table.addController({
    hostDisconnected() {
      for (let l of array) {
        l.dispose();
      }
    }
  });
};
