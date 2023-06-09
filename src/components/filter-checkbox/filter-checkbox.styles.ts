import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
    display: block;
  }

  .filter-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding: var(--sl-spacing-x-small);
    border-radius: var(--sl-border-radius-medium);
    border: 1px solid var(--sl-color-neutral-500);
    transition: all ease .3s;
  }

  .filter-checkbox:hover{
    border: 1px solid var(--sl-color-neutral-700);
  }

  .filter-checkbox:hover .icon{
    color: var(--sl-color-neutral-700);
  }

  .filter-checkbox:hover sl-checkbox::part(control){
    border-color: var(--sl-color-neutral-700);
  }

  sl-checkbox{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  sl-checkbox::part(base) {
    margin: 0;
    padding: 0;
  }

  sl-checkbox::part(label) {
    height: 0px;
    width: 0px;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: .8em;
    color: var(--sl-color-neutral-400);
    padding: var(--sl-spacing-3x-small) 0 var(--sl-spacing-3x-small) var(--sl-spacing-x-small);
    transition: all ease .3s;
  }

  sl-popup::part(popup) {
    z-index: 9999;
  }

  .menu  {
    display: flex;
    flex-direction: column;
    background-color: var(--sl-color-neutral-0);
    padding: 0 var(--sl-spacing-medium);
    border-radius: var(--sl-border-radius-medium);
    border: 1px solid var(--sl-color-neutral-500);
    transition: all ease .3s;
  }

`;
