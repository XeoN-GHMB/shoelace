import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host {
    display: inline-block;
    --sl-date-panel-padding:1em;
    --sl-date-grid-gap:0.5em;
    --sl-date-hover-color: var(--sl-color-primary-500);
    --sl-date-color: var(--sl-color-neutral-0);
  }

  svg {
    fill: currentColor;
  }

  .date-button {
    position: relative;
    background: none;
    border: 0;
    padding: 0;
    outline: 0;
    color: var(--sl-color-neutral-600);
    border-radius: var(--borderRadius, 0.25em);
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .date-day-item {
    box-sizing: content-box;
    min-width: 2.5em;
    height: 2.5em;
    cursor: pointer;
    border-radius: 50%;
    justify-self: center;
  }
  .date-day-item:hover:not(.current):not([disabled]) {
    background-color: rgba(0, 0, 0, 0.04);
  }
  .date-day-item[disabled] {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 0.6;
  }
  .date-day-item[part=item-month] {
    padding: 3px;
    min-width: 2.8em;
    min-height: 2.8em;
  }
  .date-day-item[part=item-year] {
    padding: 3px;
    min-width: 2.8em;
    min-height: 2.8em;
  }

  .other {
    color: var(--sl-color-gray-400);
    opacity: 0;
    pointer-events: none;
  }

  .current {
    color: var(--sl-date-color);
    background-color: var(--sl-date-hover-color);
  }

  .button {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    transition: 0.3s;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.87);
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 0;
    border: 0;
  }
  .button:hover {
    color: var(--sl-date-color);
    background-color: var(--sl-date-hover-color);
  }

  /** base ***/
  .date-base {
    padding: var(--sl-date-panel-padding);
    display: relative;
    overflow: hidden;
  }
  .date-base .date-head {
    display: flex;
    align-items: center;
  }
  .date-base .date-head .date-switch {
    flex: 1;
    font-size: 14px;
    display: flex;
    justify-content: center;
    cursor: default;
    border-radius: 2px;
  }
  .date-base .date-panel {
    margin-top: 12px;
    opacity: 1;
    visibility: visible;
    transition: 0.3s opacity, 0.3s visibility;
  }
  .date-base .date-week-item {
    flex: 1;
    text-align: center;
    color: rgb(var(--sl-color-gray-400));
  }
  .date-base .date-date .date-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-gap: var(--sl-date-grid-gap);
  }
  .date-base .date-month, .date-base .date-year {
    position: relative;
    display: grid;
    left: 0;
    top: 0.8em;
    right: 0;
    bottom: 0;
    grid-gap: var(--sl-date-grid-gap);
  }
  .date-base .date-month {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
  .date-base .date-year {
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
  .date-base .animate-left {
    animation: slider-left 0.2s ease-out;
  }
  .date-base .animate-right {
    animation: slider-right 0.2s ease-out;
  }

  @keyframes slider-left {
    0% {
      transform: none;
      opacity: 1;
    }
    50% {
      transform: translateX(-50%);
      opacity: 0.5;
    }
    100% {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
  @keyframes slider-right {
    0% {
      transform: none;
      opacity: 1;
    }
    50% {
      transform: translateX(50%);
      opacity: 0.5;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
