import {
  form_control_styles_default
} from "./chunk.A5GGYLXR.js";
import {
  component_styles_default
} from "./chunk.UA53BYGW.js";
import {
  r
} from "./chunk.AXN6W67E.js";

// src/components/input/input.styles.ts
var input_styles_default = r`
  ${component_styles_default}
  ${form_control_styles_default}

  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow, var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: rgb(var(--sl-input-background-color));
    border: solid var(--sl-input-border-width) rgb(var(--sl-input-border-color));
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: rgb(var(--sl-input-background-color-hover));
    border-color: rgb(var(--sl-input-border-color-hover));
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: rgb(var(--sl-input-background-color-focus));
    border-color: rgb(var(--sl-input-border-color-focus));
    box-shadow: var(--sl-focus-ring);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: rgb(var(--sl-input-color-focus));
  }

  .input--standard.input--disabled {
    background-color: rgb(var(--sl-input-background-color-disabled));
    border-color: rgb(var(--sl-input-border-color-disabled));
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: rgb(var(--sl-input-color-disabled));
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: rgb(var(--sl-input-placeholder-color-disabled));
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: rgb(var(--sl-input-filled-background-color));
    color: rgb(var(--sl-input-color));
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: rgb(var(--sl-input-filled-background-color-hover));
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: rgb(var(--sl-input-filled-background-color-focus));
    box-shadow: var(--sl-focus-ring);
  }

  .input--filled.input--disabled {
    background-color: rgb(var(--sl-input-filled-background-color-disabled));
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: rgb(var(--sl-input-color));
    border: none;
    background: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) rgb(var(--sl-input-background-color-hover)) inset !important;
    -webkit-text-fill-color: rgb(var(--sl-color-primary-500));
  }

  .input__control::placeholder {
    color: rgb(var(--sl-input-placeholder-color));
    user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: rgb(var(--sl-input-color-hover));
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: rgb(var(--sl-input-icon-color));
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    margin: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    margin-right: var(--sl-input-spacing-small);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-left: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-right: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    margin: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    margin-right: var(--sl-input-spacing-medium);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-left: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-right: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    margin: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    margin-right: var(--sl-input-spacing-large);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-left: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-right: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    font-size: inherit;
    color: rgb(var(--sl-input-icon-color));
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: rgb(var(--sl-input-icon-color-hover));
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  .input--empty .input__clear {
    visibility: hidden;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }
`;

export {
  input_styles_default
};
