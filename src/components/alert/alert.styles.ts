import { css } from 'lit';

//language=CSS
export default css`
  :host {
    display: contents;

    --background: var(--sl-panel-background-color);
    --border-width: calc(var(--sl-panel-border-width) * 3) var(--sl-panel-border-width) var(--sl-panel-border-width) var(--sl-panel-border-width);
    --border-style: solid;
    --border-color: var(--sl-panel-border-color);
    --border-radius: var(--sl-border-radius-medium);
    --font-family: var(--sl-font-sans);
    --font-size: var(--sl-font-size-small);
    --font-weight: var(--sl-font-weight-normal);
    --color: var(--sl-color-neutral-700);
    --icon-color: var(--sl-panel-border-color);
    --icon-size: var(--sl-font-size-large);
    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background: var(--background-color);
    border-width: var(--border-width);
    border-style: var(--border-style);
    border-color: var(--border-color);
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    line-height: 1.6;
    color: var(--color);
    margin: inherit;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--icon-size);
    padding-inline-start: var(--sl-spacing-large);
    color: var(--icon-color);
  }

  .alert--primary {
    --border-color: var(--sl-color-primary-600);
    --background-color: var(--sl-color-primary-100);
  }

  .alert--primary .alert__icon {
    --icon-color: var(--sl-color-primary-600);
  }

  .alert--success {
    --border-color: var(--sl-color-success-600);
    --background-color: var(--sl-color-success-100);
  }

  .alert--success .alert__icon {
    --icon-color: var(--sl-color-success-600);
  }

  .alert--neutral {
    --border-color: var(--sl-color-neutral-600);
    --background-color: var(--sl-color-neutral-100);
  }

  .alert--neutral .alert__icon {
    --icon-color: var(--sl-color-neutral-600);
  }

  .alert--warning {
    --border-color: var(--sl-color-warning-600);
    --background-color: var(--sl-color-warning-100);
  }

  .alert--warning .alert__icon {
    --icon-color: var(--sl-color-warning-600);
  }

  .alert--danger {
    --border-color: var(--sl-color-danger-600);
    --background-color: var(--sl-color-danger-100);
  }

  .alert--danger .alert__icon {
    --icon-color: var(--sl-color-danger-600);
  }

  .alert--info {
    --border-color: var(--sl-color-info-600);
    --background-color: var(--sl-color-info-100);
  }

  .alert--info .alert__icon {
    --icon-color: var(--sl-color-info-600);
  }

  .alert--secondary {
    --border-color: var(--sl-color-secondary-600);
    --background-color: var(--sl-color-secondary-100);
  }

  .alert--secondary .alert__icon {
    --icon-color: var(--sl-color-secondary-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--sl-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
    padding-inline-end: var(--sl-spacing-medium);
  }
`;
