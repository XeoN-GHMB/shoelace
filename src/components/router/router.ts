import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { watch } from '../../internal/watch';
//import { isFunction } from '../../utilities/common';
import { defaultResove, getPathNames, isPathURLMatchPattern, PathNameResult, ResovlePathInterface, stripExtraTrailingSlash } from './pathResovle';
import styles from './router.styles';
export type RouterItem = {
  name?: string /**路径名称 */;
  path: string /***匹配路径 */;
  import?: string | (() => any | Promise<any>) /**需要动态加载的资源 */;
  children?: RouterItem[] /**子路径**/;
  component: string | ((data: RouterContextData, item: RouterItem, importResult: any) => HTMLElement | Promise<HTMLElement>); //匹配路径，如何创建组件
  afterCreate?: (el: HTMLElement, data: RouterContextData, item: RouterItem) => void | Promise<void>; //组件连接后回调
  [key: string]: string | number | unknown /***其他自定义属性 */;
};
/**
 * 申明当前路由的上下文数据
 */
export type RouterContextData = {
  path: string /***hash路径*/;
  queryString?: string /**查询字符串 */;
  queryData: { [key in string]: string | number | string[] | number[] } /**查询参数 */;
  pathData: { [key in string]: string | number } /** path 参数 */;
};

type RouterNameMap = {
  [name in string]: SlRouter;
};
const routerCache: RouterNameMap = {};

/**
 * 根据路由名称，获取路由
 * @param name,路由名称，默认为default
 */
export const getRouterByName = (name: string = 'default') => {
  return routerCache[name];
};

/**
 * @since 2.0
 * @status experimental
 *
 * @event hash-router-before emit before router,user can prevent router
 * @event hash-router-after emit after router
 * @event hash-prevented emit when router is prevented
 * @event not-found  emit when router not found
 *
 * @slot - The default slot:路由出口.
 *
 *
 */
@customElement('sl-router')
export default class SlRouter extends LitElement {
  static styles = styles;

  /**设置路由名称 */
  @property({ reflect: true, attribute: 'name' })
  name: string = 'default';

  /**设置路由路径 */
  @property({ attribute: false, reflect: false })
  routers: RouterItem[];
  constructor() {
    super();
    routerCache[this.name] = this;
  }
  @watch('name')
  watchNameChange(oldName: string, newName: string) {
    delete routerCache[oldName];
    routerCache[newName] = this;
  }
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
    this.routerChangeHanlder();
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.routerChangeHanlder);
  }
  /**  Router 守护 */
  beforeRouter: (to: { item: RouterItem; data: RouterContextData }, from: { item: RouterItem; data: RouterContextData } | undefined, next: () => void) => void;
  /** after Router */
  afterRouter: (to: { item: RouterItem; data: RouterContextData }, from: { item: RouterItem; data: RouterContextData } | undefined) => void;

  private _lastRouterItem: RouterItem;
  private _lastRouterData: RouterContextData;

  private _routerItem: RouterItem;
  private _routerData: RouterContextData;

  /**获取当前匹配路由 */
  public get routerItem() {
    return this._routerItem;
  }
  /**获取当前匹配路由数据 */
  public get routerData() {
    return this._routerData;
  }
  /**上一次匹配路由 */
  public get lastRouterItem() {
    return this._lastRouterItem;
  }
  /**上一次匹配路由数据 */
  public get lastRouterData() {
    return this._lastRouterData;
  }

  /**设置路径解析器 */
  pathResovle: ResovlePathInterface = defaultResove;

  /**
   * 获取当前导航数据
   * @returns
   */
  getCurrentPath() {
    let hash = decodeURI(window.location.hash);
    return this.pathResovle.resolvePath(hash);
  }

  /**
   * 将url 和 jsonData 转为hash 路径,并且进行导航
   * @param url 路径,例如/user/list, /user/1000, /user/100?id=2223,
   * @param jsonData 参数 例如 {a:'1',b:'2'}
   */
  toHashPath(url: string, jsonData?: PathNameResult) {
    const { path, queryData } = defaultResove.resolvePath(url);
    jsonData = Object.assign({}, queryData, jsonData);
    window.location.hash = this.pathResovle.toPath(path, jsonData);
  }

  private findMathRouterItems() {
    const path = this.getCurrentPath().path;
    if (!this.routers) {
      return null;
    }
    const parentMap = new Map<RouterItem, RouterItem>();
    const findSubRouter = (item: RouterItem, parentURl?: string) => {
      let parentURlTemp = parentURl;
      parentURlTemp = parentURlTemp ? parentURlTemp + stripExtraTrailingSlash(item.path) : item.path;
      if (item.children) {
        for (let temp of item.children) {
          parentMap.set(temp, item);
          if (findSubRouter(temp, parentURlTemp)) {
            return temp;
          }
        }
      }
      const match = isPathURLMatchPattern(path, parentURlTemp);
      if (match) {
        return item;
      }
      return null;
    };
    for (let temp of this.routers) {
      let item = findSubRouter(temp);
      if (!item) {
        continue;
      }
      let result = [];
      let matchPath = stripExtraTrailingSlash(item.path);
      result.push(item);
      while (item && parentMap.has(item)) {
        let parent = parentMap.get(item) as RouterItem;
        result.splice(0, 0, parent);
        matchPath = stripExtraTrailingSlash(parent.path) + matchPath;
        item = parent;
      }
      return { items: result, url: matchPath };
    }
    return null;
  }
  public static HASH_EVENT_BEFORE = 'hash-router-before';
  public static HASH_EVENT_AFTER = 'hash-router-after';

  /**
   * 处理路由匹配
   * @param matchItems  当前匹配的路径路径
   * @param pattern  当前路由pattern 值
   */
  protected async excuteRouterComponenent(matchItems: RouterItem[], pattern: string) {
    const item = matchItems[matchItems.length - 1];
    this._lastRouterData = this.routerData;
    this._lastRouterItem = this.routerItem;
    const importResult: any[] = [];
    for (let temp of matchItems) {
      let tempResult: any;
      if (temp.import) {
        //tempResult = isFunction(temp.import) ? await temp.import() : await import(temp.import); //FIXME
      }
      importResult.push(tempResult);
    }
    const currentPath = this.getCurrentPath();
    const currentData = {
      ...currentPath,
      pathData: getPathNames(currentPath.path, pattern) || {}
    } as RouterContextData;
    this._routerData = currentData;
    this._routerItem = item;
    let frag = document.createDocumentFragment();
    let parent: DocumentFragment | HTMLElement = frag;
    const elList: HTMLElement[] = [];
    for (let i = 0, j = matchItems.length; i < j; i++) {
      const temp = matchItems[i];
      let el: HTMLElement;
      if (typeof temp.component == 'string') {
        el = document.createElement(temp.component);
        Object.assign(el, currentData);
      } else {
        el = await temp.component(currentData, temp, importResult[i]);
      }
      elList.push(el);
      parent.appendChild(el);
      parent = el;
    }
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(frag);
    requestAnimationFrame(() => {
      elList.forEach(async (el, index) => {
        emit(el, 'sl-router-actived');
        let item = matchItems[index];
        if (item.afterCreate) {
          await item.afterCreate(el, currentData, item);
        }
      });
      this.afterRouter ? this.afterRouter({ item: item, data: this.routerData }, this.lastRouterItem ? { item: this.lastRouterItem, data: this.lastRouterData } : undefined) : undefined;
      emit(this, SlRouter.HASH_EVENT_AFTER);
    });
  }

  protected routerChangeHanlder = () => {
    const event = emit(this, SlRouter.HASH_EVENT_BEFORE, {
      cancelable: true,
      detail: {
        lastItem: this.lastRouterItem,
        data: this.lastRouterData
      }
    });
    if (event.defaultPrevented) {
      emit(this, 'hash-prevented');
      return;
    }
    const matchResult = this.findMathRouterItems();
    if (matchResult) {
      const matchItems = matchResult.items;
      const pattern = matchResult.url;
      const item = matchItems[matchItems.length - 1];
      const currentPath = this.getCurrentPath();
      const currentData = {
        ...currentPath,
        pathData: getPathNames(currentPath.path, pattern) || {}
      } as RouterContextData;
      this.beforeRouter
        ? this.beforeRouter({ item: item, data: currentData }, this.routerItem ? { item: this.routerItem, data: this.routerData } : undefined, async () => {
            this.excuteRouterComponenent(matchItems, pattern);
          })
        : this.excuteRouterComponenent(matchItems, pattern);
    } else {
      emit(this, 'not-found');
    }
  };
  /**取消导航 */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.routerChangeHanlder);
    delete routerCache[this.name];
  }
  render() {
    return html`<slot></slot>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'sl-router': SlRouter;
  }
}
