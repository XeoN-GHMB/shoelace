import { html, LitElement, nothing, PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { customStyle } from '../../internal/customStyle';
import { emit } from '../../internal/event';
import { HasSlotController } from '../../internal/slot';
import { debounceWait } from '../../internal/throttle';
import { watch } from '../../internal/watch';
import { watchProps } from '../../internal/watchProps';
import { onEvent } from '../../utilities/common';
import SlCheckbox from '../checkbox/checkbox';
import SlRadio from '../radio/radio';
import SlTreeNode from '../tree-node/tree-node';
import { cloneTreeNodeData, DEFAULT_TREE_FILTER, DEFAULT_TREE_NODE_RENDER, iteratorNodeData, TreeNodeData } from '../tree-node/tree-node-util';
import styles from './tree.styles';

/**
 * @since 2.0
 * @status experimental
 *
 * @dependency
 *
 * @event {{node: SlTreeNode,nodeData: TreeNodeData, parentData:TreeNodeData}} sl-tree-node-click - Emitted when tree-node-click.
 * @event {{node: SlTreeNode,nodeData: TreeNodeData, parentData:TreeNodeData}} sl-tree-node-toogle - Emitted when tree-node-state changed.
 * @event {{node: SlTreeNode,nodeData: TreeNodeData, parentData:TreeNodeData}} sl-tree-node-before-toogle - Emitted before tree-node-state change.
 * @event {{node: SlTreeNode,nodeData: TreeNodeData, parentData:TreeNodeData}} sl-tree-node-open - Emitted when tree-node-state change to opened.
 * @event {{node: SlTreeNode,nodeData: TreeNodeData, parentData:TreeNodeData}} sl-tree-node-close - Emitted when tree-node-state change closed.
 * @event {{node: SlTreeNode,nodeData: TreeNodeData, parentData:TreeNodeData}} sl-tree-node-before-open - Emitted before tree-node-state to open.
 * @event {{node: SlTreeNode,nodeData: TreeNodeData, parentData:TreeNodeData}} sl-tree-node-before-close - Emitted before tree-node-state to close.
 * @event {{node:SlTreeNode,checkKeyKeys:checkKeyKeys }} sl-tree-node-select-change - Emitted after tree select node change .
 *
 *
 * @slot no-data - slot:when no tree has no data  or rootNodeData is undefined.
 * @slot loading - slot:when for  loading
 * @slot footer - slot for footer
 * @slot filter - slot for custome filter
 *
 * @csspart base - The tree's base wrapper.
 * @csspart modal - The tree's loading wrapper.
 * @csspart tree-body - The tree's tree nodes wrapper.
 * @csspart tree-footer - The tree nodes footer wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customStyle()
@customElement('sl-tree')
export default class SlTree extends LitElement {
  static styles = styles;

  /** tree selectMode: supported values are: check, radio, single, none (none, means not supported check, single) */
  @property({ reflect: true }) selectMode: 'check' | 'radio' | 'single' | 'none' = 'single';

  /** Selected nodes, highlighted or not */
  @property({ attribute: false, type: Boolean }) select_highlight = false;

  /** Whether to display the root node */
  @property({ reflect: true, attribute: 'include_root', type: Boolean }) includeRoot = true;

  /** When selectMode='check', whether to support cascade selection when checked (check the upper level, the lower level is automatically selected) */
  @property({ reflect: true, attribute: 'check_casecade', type: Boolean }) checkCasecade = true;

  /** When selectMode='check', uncheck a node, whether the subordinate node is also cascaded unchecked  */
  @property({ reflect: true, attribute: 'check_off_casecade', type: Boolean }) checkOffCasecade = true;

  /** Setting is loading status */
  @property({ reflect: true, attribute: 'loading', type: Boolean }) loading = false;

  /** The nodes that have been selected by the tree, or an array of the ID values of the selected nodes if they are multi-selected, otherwise the IDs of the selected nodes */
  @property({ reflect: true, attribute: false }) checkedKeys?: unknown | Array<unknown>;

  /** Tree node filtering parameter, enabled when filtering is supported */
  @property({ attribute: false }) filterString: string | unknown = '';

  /** Tree built-in filtering of input's placeHolder */
  @property({ attribute: 'filter-input-placeholder' }) filterInputPlaceholder = '';
  /** When filtering is supported, the node filter function receives TreeNodeData, and all other parameters, true, then the node satisfies the filter condition */
  @property({ attribute: false }) filterMethod = DEFAULT_TREE_FILTER;

  /** Whether to support filtering */
  @property({ reflect: true, attribute: 'enable-filter', type: Boolean }) enableFilter = false;

  /** Data ID property, used for built-in selected nodes ,default=id */
  @property({ attribute: false }) nodeIDProperty = 'id';

  /** Node rendering functions */
  @property({ attribute: false }) nodeRender = DEFAULT_TREE_NODE_RENDER;

  /** Root Node Data Source */
  @property({ type: Object, attribute: false })
  rootNodeData?: TreeNodeData;

  /** The actual rendered root node data */
  @state()
  renderRootNodeData?: TreeNodeData;

  /** Store the mapping of the filtered node data, key:filtered node, value:original node */
  @state()
  nodeCacheMap?: WeakMap<TreeNodeData, TreeNodeData>;

  /** Store the mapping of the filtered node data, key:original data, value:filtered data */
  @state()
  nodeFilterCacheMap?: WeakMap<TreeNodeData, TreeNodeData>;

  /** Store the filtered TreeNodeData with the true match */
  @state()
  matchFilterNodeSet?: Set<TreeNodeData>;

  @state()
  private real_treeNodeRender = this.nodeRender;

  private hasSlotController = new HasSlotController(this, 'footer');

  @watch('selectMode')
  watchSelectModeChange(_oldMode: string, newMode: string) {
    if (newMode == 'check') {
      if (!Array.isArray(this.checkedKeys)) {
        let oldChecked = this.checkedKeys as string;
        let array = [];
        if (typeof oldChecked != 'undefined') {
          array.push(oldChecked);
        }
        this.checkedKeys = array;
      }
    } else if (_oldMode == 'check') {
      if (Array.isArray(this.checkedKeys) && this.checkedKeys.length > 0) {
        let first = this.checkedKeys[0];
        this.checkedKeys = first;
      }
    }
  }
  /** Implementing tree internal filtering logic */
  @watchProps(['filter', 'filterString', 'filterMethod', 'rootNodeData'])
  doFilter() {
    const rootNodeData = this.rootNodeData;
    const treeEl = this;
    if (rootNodeData && this.filterMethod && this.enableFilter) {
      const filterArray = Array.isArray(this.filterString) ? this.filterString : [this.filterString];
      const matchNodeSet = new Set<TreeNodeData>();
      const hightLightNodeSet = (this.matchFilterNodeSet = new Set<TreeNodeData>());
      const nodeVistor = (tempData: TreeNodeData, _parentNode: TreeNodeData) => {
        (tempData as any)[parentSymobl] = _parentNode; //给每一节点父节点给值。
        const match = this.filterMethod.apply(treeEl, [tempData, ...filterArray]);
        //过滤函数 绑定上下文为：当前树SLTree
        if (match) {
          hightLightNodeSet.add(tempData);
          matchNodeSet.add(tempData);
          if (_parentNode) {
            let tempParent = _parentNode; //
            while (tempParent && !matchNodeSet.has(tempParent)) {
              matchNodeSet.add(tempParent);
              tempParent = (tempParent as any)[parentSymobl];
            }
          }
        }
      };
      iteratorNodeData(rootNodeData, nodeVistor);
      const cloneRootData = cloneTreeNodeData(rootNodeData);
      const nodeCacheMap = (this.nodeCacheMap = new WeakMap());
      nodeCacheMap.set(cloneRootData, rootNodeData);
      const nodeFilterCacheMap = (this.nodeFilterCacheMap = new WeakMap());
      nodeFilterCacheMap.set(rootNodeData, cloneRootData);
      const nodeVistor2 = (tempData: TreeNodeData, _parentNode: TreeNodeData) => {
        const newData = cloneTreeNodeData(tempData);
        nodeCacheMap.set(newData, tempData);
        nodeFilterCacheMap.set(tempData, newData);
        if (matchNodeSet.has(tempData)) {
          nodeFilterCacheMap.get(_parentNode)?.children?.push(newData);
        }
      };
      if (rootNodeData.children) {
        for (let i = 0, j = rootNodeData.children.length; i < j; i++) {
          iteratorNodeData(rootNodeData.children[i], nodeVistor2, rootNodeData, i);
        }
      }
      if (matchNodeSet.size > 0) {
        this.renderRootNodeData = cloneRootData;
      } else {
        this.renderRootNodeData = undefined;
      }
    } else {
      if (this.rootNodeData) {
        const nodeVistor = (tempData: TreeNodeData, _parentNode: TreeNodeData) => {
          (tempData as any)[parentSymobl] = _parentNode; //给每一节点父节点给值。
        };
        iteratorNodeData(this.rootNodeData, nodeVistor);
      }
      this.renderRootNodeData = this.rootNodeData;
    }
  }
  constructor() {
    super();
    this.handerCheckEvent = this.handerCheckEvent.bind(this);
    this.handerRadioEvent = this.handerRadioEvent.bind(this);
  }
  /**
   * Get the parent data source
   * @data :Node Data Source
   */
  public getParentNodeData(data: TreeNodeData) {
    return (data as any)[parentSymobl] as TreeNodeData;
  }

  private renderAllTreeNode() {
    if (!this.renderRootNodeData) {
      return html`<slot name="no-data"></slot>`;
    } else {
      if (this.includeRoot) {
        return this.renderNodeDataTemplate(this.renderRootNodeData, 0);
      } else {
        const children = this.renderRootNodeData.children;
        return children ? children.map((item: TreeNodeData, index: number) => this.renderNodeDataTemplate(item, index, this.renderRootNodeData)) : nothing;
      }
    }
  }

  private renderNodeDataTemplate(data: TreeNodeData, index: number, parentData?: TreeNodeData) {
    const tree = this as SlTree;
    return html`<sl-tree-node .customStyle=${(this as any).customStyle} .tree=${tree} .nodeData=${data} index=${index} .parentNodeData=${parentData} .nodeRender=${this.real_treeNodeRender}></sl-tree-node>`;
  }
  private _emitTreeEvent(event: CustomEvent) {
    if (!event.defaultPrevented) {
      const node = event.detail.node as SlTreeNode;
      const oldType = event.type;
      const type = oldType.replace('sl-node', 'sl-tree-node');
      const nodeData = node.nodeData;
      emit(this, type, {
        cancelable: true,
        detail: {
          node: node,
          nodeData: nodeData,
          parentData: node.parentNodeData
        }
      });
    }
  }
  @state()
  hasFooter = false;
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
    let handerTreeNode = (event: CustomEvent) => {
      this._emitTreeEvent(event);
    };
    let eventArray = ['sl-node-click', 'sl-node-before-open', 'sl-node-before-close', 'sl-node-before-toogle', 'sl-node-close', 'sl-node-open', 'sl-node-toogle'];

    let div = this.renderRoot.querySelector('div[part]') as HTMLElement;
    for (let eventType of eventArray) {
      onEvent(div, 'sl-tree-node', eventType, handerTreeNode);
    }
    onEvent(div, 'sl-tree-node', 'sl-node-click', (event: CustomEvent) => {
      const tree_node = event.detail.node as SlTreeNode;
      if (this.selectMode == 'single' && tree_node.nodeData && !Boolean(tree_node.nodeData.disable)) {
        this.checkedKeys = tree_node.nodeData[this.nodeIDProperty] || '';
        emit(this, 'sl-tree-node-select-change', {
          detail: {
            node: tree_node,
            checkKeyKeys: this.checkedKeys
          }
        });
      }
    });
  }
  render() {
    const baseClass = {
      'base-has-footer': this.hasFooter
    };
    return html`<div part="base" class=${classMap(baseClass)}>
      ${this.enableFilter
        ? html`<div part="filter">
            <slot name="filter"> <sl-input part="filter-input" .placeholder=${this.filterInputPlaceholder} @sl-input=${this.inputFilterHanlder} .value=${String(this.filterString)}></sl-input></slot>
          </div>`
        : ''}
      <div part="tree-body">${this.renderAllTreeNode()}</div>
      <div part="tree-footer"><slot name="footer" @slotchange=${this.slotChangeHandler}></slot></div>
      ${this.loading
        ? html`<div class="modal" part="modal">
            <slot name="loading"><div class="loading"></div></slot>
          </div>`
        : ''}
    </div>`;
  }
  private slotChangeHandler() {

    this.hasFooter = this.hasSlotController.test('footer');
  }
  private inputChangeHander = debounceWait((inputString: string) => {
    this.filterString = inputString;
  }, 10);
  private inputFilterHanlder(event: Event) {
    let inputString = (event.target as any).value;
    requestAnimationFrame(() => {
      this.inputChangeHander(inputString);
    });
  }
  private async handerCheckEvent(event: Event) {
    let checked = (event.target as any).checked as boolean;
    let array = this.checkedKeys as Array<unknown>;
    let node = this.getClosetTreeNode(event.target as HTMLElement) as SlTreeNode;
    let nodeData = node.nodeData as TreeNodeData;

    if (checked) {
      //checkbox 选中
      const iteratorSubData = (subNodeData: TreeNodeData) => {
        let nodeID = subNodeData[this.nodeIDProperty];
        let disabled = Boolean(subNodeData.disable);
        if (typeof nodeID != 'undefined' && !disabled) {
          if (!array.includes(nodeID)) {
            array.push(nodeID);
          }
        }
      };
      if (this.checkCasecade) {
        iteratorNodeData(nodeData, iteratorSubData);
      } else {
        iteratorSubData(nodeData);
      }
    } else {
      //取消选中
      const iteratorSubData = (subNodeData: TreeNodeData) => {
        let nodeID = subNodeData[this.nodeIDProperty];
        let disabled = Boolean(subNodeData.disable);
        if (typeof nodeID != 'undefined' && !disabled) {
          let index = array.indexOf(nodeID);
          if (index >= 0) {
            array.splice(index, 1);
          }
        }
      };
      if (this.checkOffCasecade) {
        iteratorNodeData(nodeData, iteratorSubData);
      } else {
        iteratorSubData(nodeData);
      }
    }
    this.checkedKeys = [...array];
    await this.updateComplete;
    emit(this, 'sl-tree-node-select-change', {
      detail: {
        node: node,
        checkKeyKeys: array
      }
    });
  }
  private async handerRadioEvent(event: Event) {
    let node = this.getClosetTreeNode(event.target as HTMLElement) as SlTreeNode;
    let checked = (event.target as any).checked as boolean;
    let tempChecke = '';
    if (Array.isArray(this.checkedKeys)) {
      tempChecke = this.checkedKeys[0] as string;
    }
    let nodeData = node.nodeData as TreeNodeData;
    if (checked && typeof nodeData[this.nodeIDProperty] != 'undefined') {
      tempChecke = nodeData[this.nodeIDProperty] as string;
    } else {
      tempChecke = '';
    }
    this.checkedKeys = tempChecke;
    await this.updateComplete;
    emit(this, 'sl-tree-node-select-change', {
      detail: {
        node: node,
        checkKeyKeys: tempChecke
      }
    });
  }

  @watchProps(['nodeRender', 'selectMode', 'select_highlight', 'checkedKeys'])
  watchNodeRenderChange() {
    const handerNodeSelect = (event: Event) => {
      const node = event.target as HTMLElement;
      if (node.tagName.toLocaleUpperCase() == 'sl-checkbox' || node.tagName.toLocaleUpperCase() == 'sl-radio') {
        return;
      }
      if (this.selectMode == 'check') {
        let checkBox = node.querySelector(':scope > sl-checkbox') as SlCheckbox;
        if (checkBox && !checkBox.disabled) {
          checkBox.checked = !checkBox.checked;
          emit(checkBox, 'sl-change');
        }
      } else if (this.selectMode == 'radio') {
        let checkBox = node.querySelector(':scope > sl-radio') as SlRadio;
        if (checkBox && !checkBox.disabled) {
          checkBox.checked = true;
          emit(checkBox, 'sl-change');
        }
      }
    };
    this.real_treeNodeRender = (node: TreeNodeData, index?: number, parentNodeData?: TreeNodeData) => {
      const result = this.nodeRender(node, index, parentNodeData);
      const array = [];
      if (this.selectMode == 'check') {
        array.push(
          html`<sl-checkbox
            .disabled=${Boolean(node.disable)}
            .nodeData=${node}
            @sl-change=${this.handerCheckEvent}
            class="selectCheckbox"
            .checked=${typeof node[this.nodeIDProperty] != 'undefined' && (this.checkedKeys as Array<unknown>).includes(node[this.nodeIDProperty])}
            >${result}</sl-checkbox
          >`
        );
      } else if (this.selectMode == 'radio') {
        array.push(
          html`<sl-radio
            .disabled=${Boolean(node.disable)}
            .nodeData=${node}
            @sl-change=${this.handerRadioEvent}
            class="selectRadio"
            .checked=${typeof node[this.nodeIDProperty] != 'undefined' && this.checkedKeys == node[this.nodeIDProperty]}
            >${result}</sl-radio
          >`
        );
      } else {
        array.push(result);
      }
      return html`<div part="select-part" @click=${handerNodeSelect}>${array}</div>`;
    };
  }

  /**
   *  Get the DOM's nearest TreeNode:
   * @param el tree shadowRoot Internal elements
   * @throws when el getRootNode()==document
   */
  public getClosetTreeNode(el: HTMLElement): SlTreeNode | null {
    if (el.getRootNode() == document) {
      throw new Error('el should  in tree ShadowRoot !');
    }
    if (el instanceof SlTreeNode) {
      return el;
    } else {
      let root = el.getRootNode() as ShadowRoot;
      let temp;
      while (root != null) {
        temp = root.host;
        if (temp instanceof SlTreeNode) {
          return temp;
        }
        root = temp.getRootNode() as ShadowRoot;
      }
    }
    return null;
  }
}
const parentSymobl = Symbol('parent');
declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': SlTree;
  }
}
