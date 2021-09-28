import { html, LitElement, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '../../components/icon/icon';
import { hideElement, showElement } from '../../directives/hideOrShowAnimate';
import { customStyle } from '../../internal/customStyle';
import { emit } from '../../internal/event';
import { watch } from '../../internal/watch';
import SlTree from '../tree/tree';
import { DEFAULT_TREE_NODE_RENDER, NodeRenderInterface, TreeNodeData } from './tree-node-util';
import styles from './tree-node.styles';

/**
 * @since 2.0
 * @status experimental
 *
 * @dependency sl-icon
 *
 * @event {{nodeData:TreeNodeData,node:SlTreeNode}} sl-node-click - Emitted when node name click.
 * @event {{nodeData:TreeNodeData,node:SlTreeNode}} sl-node-before-open - Emitted before node open .
 * @event {{nodeData:TreeNodeData,node:SlTreeNode}} sl-node-before-close - Emitted before node close .
 * @event {{nodeData:TreeNodeData,node:SlTreeNode}} sl-node-before-toogle - Emitted before node state change :open or close.
 * @event {{nodeData:TreeNodeData,node:SlTreeNode}} sl-node-close - Emitted after node state close.
 * @event {{nodeData:TreeNodeData,node:SlTreeNode}} sl-node-open - Emitted after node state opened.
 * @event {{nodeData:TreeNodeData,node:SlTreeNode}} sl-node-toogle - Emitted when node state toogle.
 *
 * @csspart base - The component's base wrapper.
 * @csspart node - The component's node self wrapper.
 * @csspart children - The component's children wrapper.
 * @csspart node_toogle_icon - The component's toogle icon.
 * @csspart node-icon - The node icon.
 * @csspart node-span - The component's node text render wrapper .
 *
 * @cssproperty --sl-spacing-xx-small - toogle-icon's margin from text .
 */
@customStyle()
@customElement('sl-tree-node')
export default class SlTreeNode extends LitElement {
  static styles = styles;

  /** tree-node子节点DIV */
  @query('div[part=children]', true)
  childTreeNodeElement: HTMLElement;
  /** 本身node 渲染容器 */
  @query('div[part=node]', true)
  treeNodeElement: HTMLElement;

  /** 节点数据源 */
  @property({ type: Object, attribute: false })
  nodeData?: TreeNodeData;

  @watch('nodeData')
  _watchOnSetNodeData() {
    if (this.nodeData) {
      //默认关闭
      if (typeof this.nodeData.close == 'undefined') {
        this.nodeData.close = true;
      }
      //默认允许关闭
      if (typeof this.nodeData.closeable == 'undefined') {
        this.nodeData.closeable = true;
      }
    }
  }

  /** 绑定树对象 */
  @property({ type: Object, attribute: false })
  tree: SlTree;

  /** 树节点渲染器 */
  @property({ type: Object, attribute: false })
  nodeRender: NodeRenderInterface = DEFAULT_TREE_NODE_RENDER;

  /** 父节点数据 */
  parentNodeData?: TreeNodeData;

  private renderChildren() {
    let levelStr = this.getAttribute('level');
    let level = 1;
    if (levelStr) {
      level = parseInt(levelStr, 10) + 1;
    }
    return html`${!this.isClose
      ? this.nodeData?.children?.map((data, index) => {
        return html`<sl-tree-node
            .nodeData=${data}
            .parentNodeData=${this.nodeData}
            .customStyle=${(this as any).customStyle}
            .nodeRender=${this.nodeRender}
            .tree=${this.tree}
            index=${index}
            level=${level + ''}
            style="--sl-node-level:${level}"
          ></sl-tree-node>`;
      })
      : ''}`;
  }
  /** 获取直接孩子数量 */
  get subChildSize() {
    return this.nodeData && this.nodeData.children ? this.nodeData.children.length : 0;
  }
  /** 是否是关闭状 */
  get isClose() {
    return this.nodeData && this.nodeData.close;
  }
  private isTreeNodeSelected() {
    let tree = this.tree;
    if (tree && this.nodeData) {
      let idKey = this.nodeData[tree.nodeIDProperty];
      if (tree.selectMode == 'single' && tree.checkedKeys == idKey) {
        return true;
      }
      if (tree.select_highlight && tree.selectMode != 'none') {
        if (Array.isArray(tree.checkedKeys)) {
          return tree.checkedKeys.includes(idKey);
        } else {
          return tree.checkedKeys == idKey;
        }
      }
    }
    return false;
  }
  render() {
    if (!this.nodeData) {
      return nothing;
    }
    return html`<div part="base">
      <div part="node" ?disabled=${Boolean(this.nodeData.disable)} ?selected=${this.isTreeNodeSelected()}>${this.renderNodeData()}</div>
      <div part="children"  class="${this.isClose ? 'close' : 'open'}">${this.renderChildren()}</div>
    </div>`;
  }
  private emitEvent(eventType: string, event: Event) {
    return emit(this, eventType, {
      cancelable: true,
      detail: {
        nodeData: this.nodeData,
        node: ((event.target as Element).getRootNode() as any).host as SlTreeNode
      }
    });
  }
  private async _clickTrigerHander(event: Event) {
    if (this.subChildSize > 0) {
      let isClosed = this.isClose;//当前节点收缩状态
      let children = this.renderRoot.querySelector("div[part=children]") as HTMLElement;
      let custEvent = this.emitEvent(`sl-node-before-${isClosed ? 'open' : 'close'}`, event);
      let custToogleEvent = this.emitEvent(`sl-node-before-toogle`, event);
      if (!custEvent.defaultPrevented && !custToogleEvent.defaultPrevented) {
        if (!isClosed) {//是打开状态
          hideElement(children, { duration: 300 }, () => {
            children.classList.add('close');
            this.setNodeDataProperty('close', !this.nodeData?.close);
          })
        } else {
          this.setNodeDataProperty('close', !this.nodeData?.close);
        }
        await this.updateComplete;
        if (isClosed) {
          showElement(children, { duration: 300 })
        }
        this.emitEvent(`sl-node-${isClosed ? 'open' : 'close'}`, event);
        this.emitEvent(`sl-node-toogle`, event);
      }
    }
  }
  static NODE_OPEN_ICON = 'caret-down-fill';
  static NODE_CLOSE_ICON = 'caret-right';
  private renderNodeData() {
    const result = [];
    if (this.nodeData) {
      if (this.nodeData.closeable) {
        result.push(html`<sl-icon
          @click=${this._clickTrigerHander}
          part="node_toogle_icon"
          class="trigger-status"
          ?empty=${this.subChildSize === 0}
          .name=${this.isClose ? SlTreeNode.NODE_CLOSE_ICON : SlTreeNode.NODE_OPEN_ICON}
        >
        </sl-icon>`);
      }
      if (this.nodeData.icon) {
        result.push(html`<sl-icon class="node-icon" part="node-icon" name=${this.nodeData.icon} library="system"> </sl-icon>`);
      }
      let indexStr = this.getAttribute('index');
      let index = 0;
      if (indexStr) {
        index = parseInt(indexStr, 10);
      }
      result.push(html`<div part="node-span" @click=${this._clickNodeHandler}>${this.nodeRender.call(this, this.nodeData, index, this.parentNodeData)}</div>`);
    }
    return result;
  }
  private _clickNodeHandler(event: Event) {
    this.emitEvent('sl-node-click', event);
  }

  public setNodeDataProperty(key: string, value: unknown) {
    (this.nodeData as any)[key] = value;
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree-node': SlTreeNode;
  }
}
