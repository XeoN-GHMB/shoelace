import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import styles from './markdown-element.styles';
import Vditor from 'vditor';
import { watch } from '../../internal/watch';
import ant from 'vditor/dist/css/content-theme/ant-design.css';
import dark from 'vditor/dist/css/content-theme/dark.css';
import light from 'vditor/dist/css/content-theme/light.css';
import wechat from 'vditor/dist/css/content-theme/wechat.css';

const mapCssMap = {
  ant,
  dark,
  light,
  wechat
};
/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 *
 *
 *
 *
 *
 * @csspart base - The component's base wrapper.
 *
 *
 */
@customElement('sl-markdown-element')
export default class SlMarkdownElement extends LitElement {
  static styles = styles;

  /**  mdsrc markdown resource */
  @property({ type: String }) mdsrc: string;

  /**  the markdown string  */
  @property({ type: String }) markdown: string;

  /** theme name for  prismjs  */
  @property({ type: String, attribute: false, reflect: true }) theme: 'light' | 'dark' | 'ant' | 'wechat' = 'ant';

  @state() _themeCss: string;

  @watch('theme')
  themeChange() {
    if (mapCssMap[this.theme]) {
      this._themeCss = mapCssMap[this.theme];
    } else {
      this._themeCss = '';
    }
  }
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
  }
  update(map: PropertyValues) {
    super.update(map);
    if (this.mdsrc && (map.has('mdsrc') || map.has('_themeCss') || map.has('theme'))) {
      this.fetchAsText(this.mdsrc).then(markdown => {
        this.markdown = markdown;
        Vditor.md2html(markdown).then(res => {
          this.baseDiv.innerHTML = res;
          Vditor.mindmapRender(this.baseDiv, this.cdn, this.theme);
          Vditor.mathRender(this.baseDiv);
          Vditor.mermaidRender(this.baseDiv, this.cdn, this.theme);
          Vditor.abcRender(this.baseDiv);
          Vditor.mediaRender(this.baseDiv);
          Vditor.highlightRender({ lineNumber: true, enable: true }, this.baseDiv);
          Vditor.graphvizRender(this.baseDiv);
          Vditor.flowchartRender(this.baseDiv);
          Vditor.plantumlRender(this.baseDiv);
          Vditor.chartRender(this.baseDiv, this.cdn, this.theme);
        });
      });
    }
  }

  private cdn: string = 'https://cdn.jsdelivr.net/npm/vditor@3.8.6';
  @state()
  fetchMode: 'cors' | 'same-origin' | 'no-cors' | 'navigate' = 'same-origin';
  /**
   * @method fetchAsText
   * @description method to fetch markdown from a url or path
   * @param {String} src  url to fetch
   * @return {Promise}
   */
  fetchAsText(src: string) {
    return fetch(src, {
      mode: this.fetchMode
    }).then(res => res.text());
  }

  @query('#base')
  private baseDiv: HTMLDivElement;

  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`<style>
        ${this._themeCss}
      </style>
      <div id="base"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-markdown-element': SlMarkdownElement;
  }
}
