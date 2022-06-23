import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

//language=CSS
export default css`
  ${componentStyles}

  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    /*border-top-width: calc(var(--sl-panel-border-width) * 3)*/
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--box-shadow);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: 1.6;
    color: var(--sl-color-neutral-700);
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
    font-size: var(--sl-font-size-large);
    padding-inline-start: var(--sl-spacing-large);
  }

  .alert--primary {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-100);
  }

  .alert--primary .alert__icon {
    color: var(--sl-color-primary-600);
  }

  .alert--success {
    border-color: var(--sl-color-success-600);
    background-color: var(--sl-color-success-100);
  }

  .alert--success .alert__icon {
    color: var(--sl-color-success-600);
  }

  .alert--neutral {
    border-color: var(--sl-color-neutral-600);
    background-color: var(--sl-color-neutral-100);
  }

  .alert--neutral .alert__icon {
    color: var(--sl-color-neutral-600);
  }

  .alert--warning {
    border-color: var(--sl-color-warning-600);
    background-color: var(--sl-color-warning-100);
  }

  .alert--warning .alert__icon {
    color: var(--sl-color-warning-600);
  }

  .alert--danger {
    border-color: var(--sl-color-danger-600);
    background-color: var(--sl-color-danger-100);
  }

  .alert--danger .alert__icon {
    color: var(--sl-color-danger-600);
  }

  .alert--info {
    border-color: var(--sl-color-info-600);
    background-color: var(--sl-color-info-100);
  }

  .alert--info .alert__icon {
    color: var(--sl-color-info-600);
  }

  .alert--secondary {
    border-color: var(--sl-color-secondary-600);
    background-color: var(--sl-color-secondary-100);
  }

  .alert--secondary .alert__icon {
    color: var(--sl-color-secondary-600);
  }

  .alert__message {
    flex: 1 1 auto;
    padding: var(--sl-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-large);
    padding-inline-end: var(--sl-spacing-medium);
  }
`;
