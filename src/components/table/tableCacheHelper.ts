import { getLocalCache, removeLocalCache, setLocalCache } from '../../utilities/localCache';
import SlColumn from '../column/column';
import SlTable from './table';

/**
 * 前端控制缓存table 布局
 * 包括width,order,hidden
 *
 */
/**定义SlTable 缓存结构 */
type TableCacheItem = {
  field: string;
  value: {
    width: string;
    order: number;
    hidden: boolean;
  };
};
type TableCacheType = Array<TableCacheItem>;

/**
 * 读取table 状态
 * @param table
 * @returns
 */
export const readTableAsCacheValue = (table: SlTable) => {
  let columns = Array.from(table.children).filter((item: Element) => {
    return item instanceof SlColumn;
  }) as SlColumn[];
  let result: TableCacheType = [];
  const iteratorColumn = (item: SlColumn) => {
    let sub = item.childAllColumn;
    if (sub.length == 0 && item.field) {
      //有子项的直接不管
      result.push({
        field: item.field,
        value: {
          width: item.width ? item.width : '',
          order: item.order,
          hidden: item.hidden
        }
      });
    }
    for (let l of sub) {
      iteratorColumn(l);
    }
  };
  columns.forEach(iteratorColumn);
  return result;
};
const getTableCacheKey = (key: string | undefined, isDefault = false) => {
  return key ? 'sl_table_cache_' + key + (isDefault ? '_default' : '') : null;
};
export const removeTableCacheByKey = (key: string) => {
  let keyValue = getTableCacheKey(key, false) as string;
  removeLocalCache(keyValue);
  keyValue = getTableCacheKey(key, true) as string;
  removeLocalCache(keyValue);
};
/**
 * 恢复缺省，去掉所有缓存
 * @param table
 */
export const restoreTableDefault = (table: SlTable) => {
  if (table.cacheKey) {
    let key = getTableCacheKey(table.cacheKey, true) as string;
    let cache = getLocalCache(key) as TableCacheType;
    if (cache) {
      restoreFormTableCache(table, cache);
    }
    removeLocalCache(key);
    key = getTableCacheKey(table.cacheKey, false) as string;
    removeLocalCache(key);
  }
};

/**
 * 将缓存应用到table
 * @param table
 * @param cache
 */
export const restoreFormTableCache = (table: SlTable, cache: TableCacheType) => {
  cache.forEach(item => {
    const field = item.field;
    const value = item.value;
    const column = table.querySelector(`sl-column[field="${field}"]`) as SlColumn;
    if (column) {
      if (value.width) {
        column.width = value.width;
      } else {
        column.width = 'auto';
      }
      column.order = value.order;
      column.hidden = value.hidden;
    }
  });
};

export const restoreFromLocalCache = (table: SlTable) => {
  if (!table.cacheKey) {
    return;
  }
  let key = getTableCacheKey(table.cacheKey, false) as string;
  try {
    let cache = getLocalCache(key) as TableCacheType;
    if (cache) {
      restoreFormTableCache(table, cache);
    }
  } catch (error) {
    console.log('cache key= ' + key + 'value is not valid');
    console.error(error);
  }
};
export const saveAsDefaultTableCache = (table: SlTable) => {
  if (!table.cacheKey) {
    return;
  }
  let key = getTableCacheKey(table.cacheKey, true) as string;
  let cache = getLocalCache(key) as TableCacheType;
  if (!cache) {
    cache = readTableAsCacheValue(table);
    setLocalCache(getTableCacheKey(table.cacheKey, true) as string, cache);
  }
};
export const updateTableCache = (table: SlTable) => {
  if (!table.cacheKey) {
    return;
  }
  let cache = readTableAsCacheValue(table);
  setLocalCache(getTableCacheKey(table.cacheKey, false) as string, cache);
};
