import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
    display: block;
  }

  .bone-wrapper{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 10px;
  }

  .bone-wrapper sl-input,
  .bone-wrapper sl-select{
    flex: 1;
  }

  .bone-name{
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: flex-start;
    min-width: 230px;
    font-size: var(--sl-input-font-size-medium);
    min-height: var(--sl-input-height-medium);
    padding: 0.4em 0.7em;
    background-color: var(--sl-color-neutral-100);
    border: 1px solid var(--sl-color-neutral-200);
    border-top-left-radius: var(--sl-input-border-radius-medium);
    border-bottom-left-radius: var(--sl-input-border-radius-medium);
  }

  sl-input::part(base),
  sl-select::part(control){
    box-shadow: none !important;
  }

  .bone-name + sl-input::part(base),
  .bone-name + sl-select::part(control) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .file-container{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex: 1;
  }

  .file-container sl-input{
    flex: 1;
  }
 .file-container sl-progress-bar{
    flex: 1;
  }

  .file-container sl-input::part(base){
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .file-container .upload-button,
  .file-container .clear-button{
    margin-left: 5px;
  }

  .bone-wrapper .upload-button::part(base),
  .bone-wrapper .clear-button::part(base),
  .bone-wrapper .add-button::part(base),
  .bone-wrapper .undo-button::part(base){
    aspect-ratio: 1;
  }

  .bone-wrapper sl-switch{
    border: 1px solid var(--sl-color-neutral-300);
    padding: .4em .1em .4em .4em;
    border-top-right-radius: var(--sl-input-border-radius-medium);
    border-bottom-right-radius: var(--sl-input-border-radius-medium);

    --height: calc(var(--sl-input-height-medium) - 1em);
    --width: calc( 1.7 * (var(--sl-input-height-medium) - 0.8em) );
    --thumb-size: calc(var(--sl-input-height-medium) - 1.1em);
  }

  .bone-inner-wrap{
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .bone-inner-button-wrap{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex: 1;
  }

  .bone-inner-button-wrap .clear-button,
  .bone-inner-button-wrap .undo-button{
    margin-left: 5px;
  }

  .bone-inner-button-wrap .add-button{
    margin-right: 5px;
    flex: 1;
  }

  .multi-input{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 10px;
  }

  .multi-input > div{
    flex: 1;
  }

  .multi-input .clear-button{
    margin-left: 5px;
  }

  .drag-button{
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--sl-input-height-medium);
    width: var(--sl-input-height-medium);
    cursor: move;
  }

  .drag-button::part(base){
    width: 50%;
    height: 50%;
  }

  .is-dragged{
    position: absolute;
    z-index: 2;
    background-color: rgba(255, 255, 255, .5);
    box-shadow: 0 0 5px 0 var(--sl-color-neutral-200);
  }

  .fake-drag-element{
    border: dashed 2px var(--sl-color-primary-500);
  }

  .language-tab-group{
    flex: 1;
    border: none;
  }

  .language-tab-group::part(base){
    border: none;
  }

  .language-tab-group::part(body){
    overflow-x: hidden;
  }

  .language-tab-group sl-tab-panel::part(base){
    padding: 0;
    border: none;
  }

  .language-tab-group sl-tab::part(base){
    padding: .7em;
  }

  .language-wrapper .multi-input{
      margin-bottom: 0;
  }

  .language-wrapper .multi-input sl-input:first-child::part(base),
   .language-wrapper .multi-input sl-select:first-child::part(control){
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  @media (max-width: 900px) {
    .bone-wrapper{
      flex-direction: column;
    }

    .multiple-wrapper{
      margin-top: 10px;
    }

    .bone-name{
      width: 100%;
      border-top-left-radius: var(--sl-input-border-radius-medium);
      border-top-right-radius: var(--sl-input-border-radius-medium);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .bone-name + sl-input::part(base),
    .bone-name + sl-select::part(control) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: var(--sl-input-border-radius-medium);
    }

    .bone-wrapper sl-switch{
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: var(--sl-input-border-radius-medium);
    }

    .language-wrapper .multi-input sl-input:first-child::part(base),
   .language-wrapper .multi-input sl-select:first-child::part(control){
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

  }
`;
