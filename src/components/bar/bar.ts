import SlBar from './bar.component.js';

export * from './bar.component.js';
export default SlBar;

SlBar.define('sl-bar');

declare global {
  interface HTMLElementTagNameMap {
    'sl-bar': SlBar;
  }
}
