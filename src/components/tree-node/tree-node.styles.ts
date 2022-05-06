import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

//language=CSS
export default css`
  ${componentStyles}

  :host {
    display: block;
  }

  .trigger-status {
    display: inline-block;
    position: relative;
    margin-right: var(--sl-spacing-x-small);
    margin-left: var(--sl-spacing-x-small);
    font-size: var(--sl-node-trigger-size, 12px);
    cursor: pointer;
  }

  .trigger-status[empty] {
    cursor: default;
    opacity: 0;
  }

  .node-icon {
    position: relative;
    vertical-align: middle;
    top: var(--node-icon-top, 0);
    color: var(--node-icon-color, inherit);
  }

  :host([selected]) div[part=node] {
    cursor: pointer;
  }

  div[part=base] {
    white-space: nowrap;
  }
  div[part=base] div[part=node] {
    display: flex;
    position: relative;
    align-items: center;
    padding: 5px 0;
    /** Nodes shrink according to hierarchy **/
    padding-left: calc( var(--sl-node-level,0) * 0.8em);
    transition: background-color ease 0.3ms;
    /** node disabled status **/
  }
  div[part=base] div[part=node] sl-icon[part=node-icon] {
    margin-right: var(--sl-spacing-2x-small);
  }
  div[part=base] div[part=node] div[part=node-span] {
    flex: 1 1 auto;
  }
  div[part=base] div[part=node][disabled] {
    opacity: 0.7;
    color: rgb var(--sl-color-gray-100);
  }
  div[part=base] div[part=node][disabled] div[part=node-span] {
    cursor: default;
  }
  div[part=base] div[part=node][selected] {
    background-color: rgb(var(--sl-color-sky-200));
  }
  div[part=base] div[part=node][selected]::before {
    position: absolute;
    inset: 0 auto 0 0;
    border-left: 2px solid rgb(var(--sl-color-blue-500));
    content: "";
  }
  div[part=base] div[part=node]:hover {
    background-color: rgb(var(--sl-color-sky-100));
  }
  div[part=base] div[part=node]:hover::before {
    position: absolute;
    inset: 0 auto 0 0;
    border-left: 2px solid rgb(var(--sl-color-blue-500));
    content: "";
  }
  div[part=base] div[part=node]:hover[disabled] {
    background-color: rgb(var(--sl-color-gray-100));
  }
  div[part=base] div[part=node]:hover[disabled]::before {
    border-left: 2px solid rgb(var(--sl-color-gray-500));
  }
  div[part=base] div[part=node][disabled] div[part=select-part] {
    cursor: default;
  }
  div[part=base] div[part=node] div[part=select-part] {
    cursor: pointer;
  }
  div[part=base] div[part=children] {
    display: block;
  }
  div[part=base] div[part=children].close {
    display: none;
  }


`;
