import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { customStyle } from '../../internal/customStyle';
import { emit } from '../../internal/event';
import SlOrgNode, { defaultRoleRender, OrgNodeDataType } from '../org-node/org-node';
import styles from './org-tree.styles';

/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 * @event {{ node: SlOrgNode,nodeData:OrgNodeDataType }} sl-org-tree-node-click  Emitted when node click.
 * @event {{ node: SlOrgNode,nodeData:OrgNodeDataType }} sl-org-tree-node-toogle Emitted when node toogle changed.
 *

 *
 * @csspart container - The component's container wrapper.
 * @csspart tree - The component's tree wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customStyle()
@customElement('sl-org-tree')
export default class SlOrgTree extends LitElement {
  static styles = styles;
  /**
   * Organizational structure node data
   */
  @property({ type: Object })
  rootData: OrgNodeDataType;

  /**
   * Centered or not
   */
  @property({ type: Boolean, reflect: true })
  center: boolean = true;
  /**
   * Whether it is horizontal layout Organizational structure
   */
  @property({ type: Boolean, reflect: true })
  horizontal: boolean = false;
  @property({ type: Object })
  nodeRender: (node: OrgNodeDataType) => TemplateResult<1> | TemplateResult<1>[] = defaultRoleRender;
  @query('#container')
  containerEl: HTMLDivElement;

  render() {
    const tree = this;
    return html`<div class="org-tree-container " id="container" part="container">
      <div class="org-tree collapsable ${this.horizontal ? 'horizontal' : ''}" part="tree">
        ${this.rootData
          ? html`<sl-org-node
              id="root"
              class="org-tree-node"
              .style=${this.horizontal ? 'display:table' : ''}
              .nodeData=${this.rootData}
              .tree=${tree}
              .nodeRender=${this.nodeRender}
              .expanded=${this.rootData ? Boolean(this.rootData.expanded) : true}
              .collapsable=${this.rootData ? Boolean(this.rootData.collapsable) : true}
              @sl-node-click=${this.handNodeEvent}
              @sl-node-toogle=${this.handNodeEvent}
              @sl-node-before-toogle=${this.handNodeEvent}
            ></sl-org-node>`
          : null}
      </div>
    </div> `;
  }

  @query('#root', true)
  rootNode: SlOrgNode;
  private handNodeEvent(event: CustomEvent) {
    if (!event.defaultPrevented) {
      const node = event.target as SlOrgNode;
      const eventType = `sl-org-tree-${event.type.replace('sl-', '')}`;
      console.log(eventType);
      emit(this, eventType, {
        detail: {
          node: node,
          nodeData: node.nodeData
        }
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-org-tree': SlOrgTree;
  }
}
