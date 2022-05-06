import SlColumn from '../column/column';
import SlTable from './table';
import { SortingEnum } from './tableHelper';
const sortDown = svg`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" id="chevron-down"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"></path></svg>`;
const sortUp = svg`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" id="chevron-up"><path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 00.753-1.659l-4.796-5.48a1 1 0 00-1.506 0z"></path></svg>`;
import { html, svg } from 'lit';
import { emit } from '../../internal/event';
export const renderSortHeaderTemplate = (table: SlTable, column: SlColumn, hander: EventListener) => {
  let sortValue = table.sortValue;
  let sortList: Array<{
    orderBy: string;
    orderType: SortingEnum;
  }> = [];
  if (Array.isArray(sortValue)) {
    sortList = sortValue;
  } else if (sortValue) {
    sortList.push(sortValue);
  }
  let result;
  if (column.sortAble) {
    let sortResult = sortList.find(item => item.orderBy == column.field);
    if (table.sortConfig.alwaysShowIcon) {
      result = html`<div class="sort-wrap" @click=${hander}>
        <div class="sort-ASC  ${sortResult && sortResult.orderType == SortingEnum.ASC ? 'current' : ''}">${sortUp}</div>
        <div class="sort-DESC ${sortResult && sortResult.orderType == SortingEnum.DESC ? 'current' : ''}">${sortDown}</div>
      </div>`;
    } else {
      result = html`<div class="sort-wrap" @click=${hander}>
        <div class="sort-${sortResult ? sortResult.orderType : 'null'} current">
          ${sortResult && sortResult.orderType == SortingEnum.ASC ? sortUp : sortResult && sortResult.orderType == SortingEnum.DESC ? sortDown : ''}
        </div>
      </div>`;
    }
  }
  return result;
};
export const sortRenderHanlder = (column: SlColumn, table: SlTable) => {
  if (column.sortAble) {
    if (!column.field) {
      console.warn('column sort must has field value');
      return;
    }
    let value = table.sortValue;
    let config = table.sortConfig;
    let array = (value ? (Array.isArray(value) ? value : [value]) : []) as Array<{
      orderBy: string;
      orderType: SortingEnum;
    }>;
    let index = array.findIndex(item => item.orderBy == column.field);
    let currentFieldValue = index >= 0 ? array[index] : null;
    const event = emit(table, 'sl-table-before-sort', {
      cancelable: true,
      detail: {
        column: column,
        sortValue: currentFieldValue
      }
    });
    if (!event.defaultPrevented) {
      if (index >= 0) {
        array.splice(index, 1);
      }
      let orders = config.orders;
      let nextIndex = 0;
      if (currentFieldValue != null) {
        let orderIndex = orders.findIndex(item => item == currentFieldValue?.orderType);
        if (orderIndex + 1 < orders.length) {
          nextIndex = orderIndex + 1;
        } else {
          nextIndex = 0;
        }
      }
      let newSort = orders[nextIndex];
      if (newSort != SortingEnum.NULL) {
        array.push({
          orderBy: column.field,
          orderType: newSort
        });
      }

      if (config.multi) {
        table.sortValue = [...array];
      } else if (array.length > 0) {
        table.sortValue = array[array.length - 1];
      } else {
        table.sortValue = undefined;
      }
      emit(table, 'sl-table-sort', {
        detail: {
          column: column,
          sortValue: table.sortValue
        }
      });
    }
  }
};
/**
 * 将table 排序字段值转为为Sql
 * @param table
 * @param converto 处理字段转sql 字段，例如"name" ->"a.name"
 * @returns
 */
export const getSortValueAsSql = (table: SlTable, converField?: (field: string) => string) => {
  let value = table.sortValue;
  if (value) {
    let array = (value ? (Array.isArray(value) ? value : [value]) : []) as Array<{
      orderBy: string;
      orderType: SortingEnum;
    }>;
    return array
      .map(item => {
        return (converField ? converField(item.orderBy) : item.orderBy) + ' ' + item.orderType;
      })
      .join(' ');
  }
  return '';
};
