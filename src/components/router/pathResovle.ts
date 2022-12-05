import { match, MatchFunction, MatchResult, compile } from 'path-to-regexp';
/**
 * 去掉路径最后面的 '/',如果路径不是/开始，则添加'/'到最前面,连续多个'/' 则被替换为一个'/'
 * @param path
 * @returns
 */
const stripExtraTrailingSlash = (path: string) => {
  if (!path) {
    return '/';
  }
  if (path.substr(0, 1) != '/') {
    path = '/' + path;
  }
  if (path.length !== 1 && path.substr(-1) === '/') {
    path = path.substr(0, path.length - 1);
  }
  path = path.replace(REG_REMOVE, '/');
  return path;
};
const joinStringPath = (...path: string[]) => {
  const pathArray = path.map(item => (item == '' ? '' : stripExtraTrailingSlash(item)));
  return pathArray.join('').replace(REG_REMOVE, '/');
};
const REG_REMOVE = /[\/]{2,}/;

/**
 * 将查询字符串 转换为 json Object
 * @param queryString  查询字符串 ，类似 'a=b&c=d&asd=d'
 * @returns
 */
const getQueryData = (queryString?: string): { [key in string]: string | string[] } => {
  if (!queryString) {
    return {};
  }
  const result: { [key in string]: string | string[] } = {};
  const parames = new URLSearchParams(queryString);
  for (let p of parames.keys()) {
    let array = parames.getAll(p);
    if (array.length > 1) {
      result[p] = array;
    } else {
      result[p] = array[0];
    }
  }
  return result;
};
type ParamterData = {
  [key in string]: string | number | Array<string | number>;
};
/**
 * 将 json data 转化为queryString
 * @param data jsonObject
 * @returns
 */
const toQueryString = (data: ParamterData) => {
  const array: string[] = [];
  for (let key in data) {
    const value = data[key];
    const tempKey = encodeURIComponent(key);
    if (Array.isArray(value)) {
      for (let v of value) {
        array.push(tempKey + '=' + encodeURIComponent(v));
      }
    } else {
      var temp = tempKey + '=' + encodeURIComponent(value);
      array.push(temp);
    }
  }
  return array.join('&');
};

const matchResultCache = new Map<string, MatchFunction>();
/**
 * 判断路径 path ,是否匹配pattern 路径
 * @param path
 * @param pattern
 * @returns
 */
const isPathURLMatchPattern = (path: string, pattern: string) => {
  let matchFun = matchResultCache.get(pattern);
  if (!matchFun) {
    matchFun = match(pattern, {
      decode: decodeURIComponent
    });
    matchResultCache.set(pattern, matchFun);
  }
  return matchFun(path) != false;
};
/**
 * 缓存所有的pattern , key :pattern, value :{reg:正则表达式，keys:参数列表}
 */

/**
 * 判断指定路径 ，是否匹配 pattern路径，如果匹配，则返回object, 包含所有的命名参数，
 * 否则返回 null;
 * @param path
 *  @param pattern
 * @returns
 */

export type PathNameResult = {
  [key in string]: string | number;
};
const getPathNames = (path: string, pattern: string) => {
  let matchFun = matchResultCache.get(pattern);
  if (!matchFun) {
    matchFun = match(pattern, {
      decode: decodeURIComponent
    });
    matchResultCache.set(pattern, matchFun);
  }
  const result = matchFun(path);
  let pathNames: PathNameResult = {};
  if (result != false) {
    //@ts-ignore
    pathNames = Object.assign({}, (result as MatchResult).params);
  }
  return pathNames;
};

/**
 * 接口：处理解密，加密 路径和参数
 */
export interface ResovlePathInterface {
  /**
   * 将hash 路径，转为对象 path,queryString, queryData
   * ```
   * #/wanggang/list?id=232&name=test --> {path:'/wanggang/list', queryData:{id:'232',name:'test'}}
   * ```
   * @param hash
   */
  resolvePath(hash: string): { path: string; queryString: string; queryData: { [key: string]: string | number | string[] | number[] } };
  /**
   * 将url 和jsonData 转化为 hash 路径
   * 例如：url='/wanggang/list' ,jsonData={id:1,b:2}==>   #/wanggang/list?id=1&b=2
   * @param url
   * @param jsonData
   */
  toPath(url: string, jsonData?: PathNameResult): string;
}

const defaultResove: ResovlePathInterface = {
  resolvePath: (hash: string) => {
    hash = decodeURI(hash);
    let hashPath = '/';
    if (hash.length > 1 && hash.substr(0, 1) == '#') {
      hash = hash.slice(1); //#,去掉
    }
    let indexStart = hash.indexOf('?');
    let queryString = '';
    if (indexStart != -1) {
      hashPath = hash.slice(0, indexStart);
      hashPath = stripExtraTrailingSlash(hashPath);
      queryString = hash.slice(hash.indexOf('?') + 1);
    } else {
      hashPath = stripExtraTrailingSlash(hash);
      queryString = '';
    }
    return {
      path: hashPath,
      queryString: queryString,
      queryData: queryString ? getQueryData(queryString) : {}
    };
  },
  toPath: (url: string, jsonData: PathNameResult) => {
    const queryString = toQueryString(jsonData);
    const toPath = compile(url, {
      validate: false,
      encode: encodeURIComponent
    });
    const src = toPath(jsonData);
    return stripExtraTrailingSlash(src) + (queryString ? '?' + queryString : '');
  }
};

export { isPathURLMatchPattern, getPathNames, getQueryData, toQueryString, stripExtraTrailingSlash, joinStringPath, defaultResove };
