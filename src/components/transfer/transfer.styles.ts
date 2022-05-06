import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host {
    display: inline-flex;
  }

  div[part=base] {
    display: flex;
    position: relative;
  }
  div[part=base] div[part=container] {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--sl-input-border-color);
    border-radius: 2px;
  }
  div[part=base] div[part=container] div[part=header] {
    display: flex;
    align-items: center;
    padding: 8px 12px 9px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
  }
  div[part=base] div[part=container] div[part=body] {
    display: flex;
    flex: auto;
    flex-direction: column;
    overflow: hidden;
  }
  div[part=base] div[part=container] div[part=body] div[part=search] {
    position: relative;
    flex: none;
    padding: 12px;
  }
  div[part=base] div[part=container] div[part=body] div[part=body-content] {
    flex: auto;
    position: relative;
    width: var(--list-width, 300px);
    margin: 0;
    padding: 0;
    overflow: auto;
    list-style: none;
  }
  div[part=base] div[part=container] div[part=body] div[part=body-content] > sl-scroll {
    height: 100%;
  }
  div[part=base] div[part=container] div[part=body] .emptyData {
    position: absolute;
    top: 50%;
    width: 100%;
    padding-top: 0;
    color: rgba(0, 0, 0, 0.25);
    text-align: center;
    transform: translateY(-50%);
  }
  div[part=base] span[part=title] {
    flex: 1;
    text-align: right;
  }
  div[part=base] div[part=base-operation] {
    display: flex;
    flex-direction: column;
    align-self: center;
    margin: 0 8px;
    vertical-align: middle;
  }
  div[part=base] .render-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px 12px;
    transition: all 0.3s;
  }
  div[part=base] .render-item sl-checkbox[part=render-checkbox] {
    margin-right: 6px;
  }
  div[part=base] .render-item:hover {
    background-color: var(--sl-color-primary-50);
    color: var(--sl-color-primary-700);
  }
  div[part=base] .render-item .render-item-label {
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  div[part=base] .table {
    height: 100%;
  }
  div[part=base] .table::part(base), div[part=base] .table::part(scroll-div) {
    height: 100%;
  }
  div[part=base] .table::part(table), div[part=base] .table::part(table)::after {
    border-left: none;
  }
`;
