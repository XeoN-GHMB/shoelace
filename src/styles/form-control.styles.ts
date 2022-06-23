import { css } from 'lit';
//language=CSS
export default css`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label {
    display: flex;
    flex-direction: column;
  }

  .form-control--has-label.form-control__label-left {
    display: flex;
    flex-direction: row;
  }

  .form-control--has-label.form-control__label-left .form-control__label {
    border-radius: 0.4em;
    border: 1px solid #e0e0e0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding: 0.3em 1.125em;
    min-width: 220px;
    height: var(--sl-input-height-medium);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .form-control--has-label.form-control--small.form-control__label-left .form-control__label {
    height: var(--sl-input-height-small);
  }

  .form-control--has-label.form-control--large.form-control__label-left .form-control__label {
    height: var(--sl-input-height-large);
    padding: 0.7em 1.125em;
  }

  .form-control--has-label.form-control__label-left .form-control__input {
    width: 100%;
  }

  .form-control--has-label.form-control__label-left .form-control__input .input,
  .form-control--has-label.form-control__label-left .form-control__input .select__control{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-control--has-label.form-control__label-left .form-control__input .textarea{
    border-top-left-radius: 0;
  }

  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control_label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
  }

  .form-control--has-help-text .form-control__help-text ::slotted(*) {
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }
`;
