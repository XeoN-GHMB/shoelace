import { isFunction } from '../../utilities/common';
import SlColumn from '../column/column';
/**
 * 定义排序，升序，降序,不显示
 */
export enum SortingEnum {
  ASC = 'ASC',
  DESC = 'DESC',
  NULL = 'null'
}
const columnCacheData = new WeakMap<SlColumn, ColumnCacheData>();

/**
 * 定义需要table 表头 行
 */
export type RowHeader = Array<Array<SlColumn>>;

/**
 * 清除原来的 PColumn 缓存计算的一些属性;
 * @param columns
 */
const clearColumnCacheData = (columns: SlColumn[]) => {
  columns.forEach(item => {
    const childColumn = item.childAllColumn;
    columnCacheData.delete(item);
    clearColumnCacheData(childColumn);
  });
};

type ColumnCacheData = {
  /** 冗余计算此TH占多少列 */
  colspan?: number;
  /** 冗余计算此TH占多少行 */
  rowspan?: number;
  /**列index */
  colIndex?: number;

  _isAuto?: boolean;
};

/**
 * 获取数据的字段值
 * @param data 数据
 * @param field 字段
 */
export const getFieldValue = (data: any, field: string | ((data: any) => any)) => {
  if (field == undefined || field == null) {
    return data;
  } else if (isFunction(field)) {
    return field(data);
  } else {
    if (field.indexOf('.') === -1) {
      return data[field];
    } else {
      const fields = field.split('.');
      let value = data;
      for (let i = 0, len = fields.length; i < len && value != null && value !== undefined; ++i) {
        value = value[fields[i]];
      }
      return value === undefined ? '' : value;
    }
  }
  return '';
};
export const setFieldValue = (data: any, field: string, value: any) => {
  if (field == undefined || field == null) {
    return data;
  } else if (field.indexOf('.') === -1) {
    data[field] = value;
  } else {
    const fields = field.split('.');
    let tempObject = data;
    for (let i = 0, len = fields.length - 1; i < len; ++i) {
      let fieldObject = tempObject[fields[i]];
      if (!fieldObject) {
        tempObject[fields[i]] = {};
        fieldObject = tempObject[fields[i]];
      }
      tempObject = fieldObject;
    }
    tempObject[fields[fields.length - 1]] = value;
  }
};
const setColumnCacheData = (column: SlColumn, key: keyof ColumnCacheData, value: any) => {
  let data = columnCacheData.get(column);
  if (!data) {
    data = {};
    columnCacheData.set(column, data);
  }
  data[key] = value;
};
const getColumnCacheDataKey = (column: SlColumn, key: keyof ColumnCacheData) => {
  let data = getColumnCacheData(column);
  if (data) {
    return data[key];
  }
  return '';
};
export const getColumnCacheData = (column: SlColumn) => {
  return columnCacheData.get(column) as ColumnCacheData;
};

/**
 * 将表头排版布局，计算出 有多少行，每个单元格跨多少行，多少列，用于渲染表头，取colspan=4 的columnData来渲染tbody TD
 * @param columns 表头
 * @returns {
 *   rows: 有多少个 TR
      leafColumns:叶子TH， 用于渲染tbody
 * }
 */
const caculateColumnData = (columns: SlColumn[]): { rows: RowHeader; leafColumns: SlColumn[] } => {
  clearColumnCacheData(columns);
  //const colspanMap=new Map<ColumnData,number>();//每个th 跨多少列
  // const rowSpanMap=new Map<ColumnData,number>();//每个th 跨多少行
  const getColSpan = (column: SlColumn) => {
    if (column.hidden) {
      return 0;
    }
    let data = columnCacheData.get(column);
    if (data && data.colspan) {
      return data.colspan;
    }
    const childColumn = column.childCanShowColumn;
    if (childColumn && childColumn.length > 0) {
      let size = 0;
      childColumn.forEach((c: SlColumn) => {
        size += getColSpan(c);
      });
      setColumnCacheData(column, 'colspan', size);
      return size;
    }
    if (data) {
      data.colspan = 1;
    } else {
      setColumnCacheData(column, 'colspan', 1);
    }
    return 1;
  };
  const canShowColumns = columns;
  let maxLevel = 0;
  const levelMap = new Map<SlColumn | undefined, Number>(); //key column, value,level
  levelMap.set(undefined, 0);
  const iteratorColumn = (column: SlColumn | undefined, childArray: SlColumn[]) => {
    if (childArray && childArray.length > 0) {
      const parentLevel = levelMap.get(column) as number;
      for (let i = 0, j = childArray.length; i < j; i++) {
        let c = childArray[i];
        if (c) {
          setColumnCacheData(c, '_isAuto', c.width == undefined || c.width === 'auto');
        }
        levelMap.set(c, parentLevel + 1);
        if (parentLevel + 1 > maxLevel) {
          maxLevel = parentLevel + 1;
        }
        getColSpan(c);
        const childColumn = c.childCanShowColumn;
        if (childColumn && childColumn.length > 0) {
          iteratorColumn(c, childColumn);
        }
      }
    }
  };
  iteratorColumn(undefined, canShowColumns);
  const iteratorForColIndex = (startColIndex: number, childArray: SlColumn[]) => {
    if (childArray && childArray.length > 0) {
      let colIndex = startColIndex;
      for (let i = 0, j = childArray.length; i < j; i++) {
        let c = childArray[i];
        if (!c.hidden) {
          setColumnCacheData(c, 'colIndex', colIndex);
          colIndex += getColSpan(c);
        }
      }
      for (let i = 0, j = childArray.length; i < j; i++) {
        let c = childArray[i];
        const childColumn = c.childCanShowColumn;
        if (childColumn && childColumn.length > 0) {
          iteratorForColIndex(getColumnCacheDataKey(c, 'colIndex') as number, c.childCanShowColumn);
        }
      }
    }
  };
  iteratorForColIndex(0, canShowColumns);

  //console.log(maxLevel);
  const rows: RowHeader = [];
  for (let i = 0, j = maxLevel; i < j; i++) {
    rows.push([]);
  }
  const renderThArray: SlColumn[] = [];
  const iteratorColumnForRow = (col: SlColumn) => {
    const level = levelMap.get(col) as number;
    const rowThead = rows[level - 1];
    rowThead.push(col);
    const childColumn = col.childCanShowColumn;
    if (childColumn && childColumn.length > 0) {
      setColumnCacheData(col, 'rowspan', 1);
      childColumn.forEach(item => iteratorColumnForRow(item));
    } else {
      const rowspan = maxLevel - level + 1;
      setColumnCacheData(col, 'rowspan', rowspan);
      renderThArray.push(col);
    }
  };
  canShowColumns.forEach((col: SlColumn) => {
    iteratorColumnForRow(col);
  });

  return {
    rows: rows, //有多少行
    leafColumns: renderThArray //叶子单元格
  };
};
/**
 * 查找PColumn 最底层最后一个能够拖动的PColumn
 * @param column
 */
export const findLastCanChangeWidth = (column: SlColumn): SlColumn => {
  const subColumns = column.childCanShowColumn;
  if (subColumns.length == 0) {
    return column;
  } else {
    return findLastCanChangeWidth(subColumns[subColumns.length - 1]);
  }
};
/**
 * 查找PColumn 对应的th
 * @param column
 *
 */
export const getThCellByColumn = (column: SlColumn): HTMLTableCellElement => {
  const table = column.table;
  const array = table.thead.querySelectorAll('th,td');
  const result = Array.from(array).find((item: Element) => (item as any).columnData == column);
  return result as HTMLTableCellElement;
};
/**
 * 判断列 是否包含 子列
 * @param column  父级列
 * @param subColumn  子列
 */
export const isColumnContainsColumn = (column: SlColumn, subColumn: SlColumn) => {
  const result = Array.from(column.querySelectorAll('sl-column')).find(item => {
    return item === subColumn;
  });
  return result != null;
};
export const isNumberWidth = (col: Number | string) => {
  return typeof col == 'number' || !isNaN(Number(col));
};
export default caculateColumnData;
