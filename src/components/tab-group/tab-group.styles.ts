import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS

export default css`
  ${componentStyles}

  :host {
    --indicator-color: var(--sl-color-primary-600);
    --track-color: var(--sl-color-neutral-200);
    --track-width: 2px;

    display: block;
  }

  .tab-group {
    display: flex;
    border: solid 1px transparent;
    border-radius: 0;
  }

  .tab-group .tab-group__tabs {
    display: flex;
    position: relative;
  }

  .tab-group .tab-group__indicator {
    position: absolute;
    transition: var(--sl-transition-fast) transform ease, var(--sl-transition-fast) width ease;
  }

  .tab-group--has-scroll-controls .tab-group__nav-container {
    position: relative;
    padding: 0 var(--sl-spacing-x-large);
  }

  .tab-group__scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: var(--sl-spacing-x-large);
  }

  .tab-group__scroll-button--start {
    left: 0;
  }

  .tab-group__scroll-button--end {
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--start {
    left: auto;
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--end {
    left: 0;
    right: auto;
  }

  /*
   * Top
   */

  .tab-group--top {
    flex-direction: column;
  }

  .tab-group--top .tab-group__nav-container {
    order: 1;
  }

  .tab-group--top .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--top .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--top .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-bottom: solid var(--track-width) var(--track-color);
  }

  .tab-group--top .tab-group__indicator {
    bottom: calc(-1 * var(--track-width));
    border-bottom: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--top .tab-group__body {
    order: 2;
  }

  .tab-group--top ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Bottom
   */

  .tab-group--bottom {
    flex-direction: column;
  }

  .tab-group--bottom .tab-group__nav-container {
    order: 2;
  }

  .tab-group--bottom .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--bottom .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--bottom .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-top: solid var(--track-width) var(--track-color);
  }

  .tab-group--bottom .tab-group__indicator {
    top: calc(-1 * var(--track-width));
    border-top: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--bottom .tab-group__body {
    order: 1;
  }

  .tab-group--bottom ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Start
   */

  .tab-group--start {
    flex-direction: row;
  }

  .tab-group--start .tab-group__nav-container {
    order: 1;
  }

  .tab-group--start .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-inline-end: solid var(--track-width) var(--track-color);
  }

  .tab-group--start .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    border-right: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--start.tab-group--rtl .tab-group__indicator {
    right: auto;
    left: calc(-1 * var(--track-width));
  }

  .tab-group--start .tab-group__body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group--start ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }

  /*
   * End
   */

  .tab-group--end {
    flex-direction: row;
  }

  .tab-group--end .tab-group__nav-container {
    order: 2;
  }

  .tab-group--end .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-right: solid var(--track-width) var(--track-color);
  }

  .tab-group--end .tab-group__indicator {
    left: calc(-1 * var(--track-width));
    border-inline-start: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--end.tab-group--rtl .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    left: auto;
  }

  .tab-group--end .tab-group__body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group--end ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }

  /* flap styling */

  .tab-group--variant-flap.tab-group--top .tab-group__tabs{
    border:0px;
  }
  .tab-group--variant-flap.tab-group--bottom .tab-group__tabs{
    border:0px;
  }
  .tab-group--variant-flap.tab-group--end .tab-group__tabs{
    border:0px;
  }
  .tab-group--variant-flap.tab-group--start .tab-group__tabs{
    border:0px;
  }

  .tab-group--variant-flap.tab-group--top ::slotted(sl-tab){
    background-color:var(--sl-shadow-large);
  }

  .tab-group--variant-flap.tab-group--top ::slotted(sl-tab[active]){
    border: 1px solid var(--sl-color-neutral-300);
    box-shadow: 2px 5px 16px 0px var(--sl-color-neutral-300), 5px 5px 15px 5px rgb(0 0 0 / 0%);
    border-bottom:0px;
  }
  .tab-group--variant-flap.tab-group--top ::slotted(:not(sl-tab[active])){
     border-bottom: 1px solid var(--sl-color-neutral-300);
  }


  .tab-group--variant-flap.tab-group--bottom ::slotted(sl-tab[active]){
    border: 1px solid var(--sl-color-neutral-300);
    box-shadow: 2px 5px 16px 0px var(--sl-color-neutral-300), 5px 5px 15px 5px rgb(0 0 0 / 0%);
    border-top:0px;
  }
  .tab-group--variant-flap.tab-group--bottom ::slotted(:not(sl-tab[active])){
     border-top: 1px solid var(--sl-color-neutral-300);
  }

  .tab-group--variant-flap.tab-group--start ::slotted(sl-tab[active]){
    border: 1px solid var(--sl-color-neutral-300);
    box-shadow: -10px 0px 16px 0px var(--sl-color-neutral-300);
    border-right:0px;
  }
  .tab-group--variant-flap.tab-group--start ::slotted(:not(sl-tab[active])){
     border-right: 1px solid var(--sl-color-neutral-300);
  }

  .tab-group--variant-flap.tab-group--end ::slotted(sl-tab[active]){
    border: 1px solid var(--sl-color-neutral-300);
    box-shadow: 10px 0px 16px 0px var(--sl-color-neutral-300);
    border-left:0px;
  }
  .tab-group--variant-flap.tab-group--end ::slotted(:not(sl-tab[active])){
     border-left: 1px solid var(--sl-color-neutral-300);
  }
`;
