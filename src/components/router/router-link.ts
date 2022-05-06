import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { PathNameResult } from './pathResovle';
import { getRouterByName } from './router';
/**
 * @since 2.0
 * @status experimental
 *
 * @event sl-router-link-before  emit before router
 */
@customElement('sl-router-link')
export default class SlRouterLink extends LitElement {
  /** 设置导航urlpattern */
  @property()
  src: string;
  /**是否为外部导航 */
  @property({ attribute: false })
  external: boolean = false;

  /**匹配SlRouter 路由，如果未指定则等同default */
  @property({ attribute: false })
  routerName: string;

  /** 导航要提交的参数或者路径数据 */
  @property({ type: Object, attribute: false })
  data: PathNameResult;
  render() {
    return html`<a part="link" @click=${this.goToLink} .href=${this.src} .data=${this.data}><slot></slot></a>`;
  }
  public get router() {
    return getRouterByName(this.routerName);
  }
  private goToLink(event: Event) {
    let linkEvent = emit(this, 'sl-router-link-before', {
      cancelable: true
    });
    if (!linkEvent.defaultPrevented && !this.external) {
      event.preventDefault();
      const router = this.router;
      if (router && this.src) {
        router.toHashPath(this.src, this.data);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-router-link': SlRouterLink;
  }
}
