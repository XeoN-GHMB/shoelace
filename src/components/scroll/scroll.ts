import { LitElement, html, PropertyValues } from 'lit';
import { customElement, eventOptions, property, query } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { throttle } from '../../internal/throttle';
import { getCssValue } from '../../utilities/common';
import styles from './scroll.styles';

/**
 * (x: number, y: number): void;
 */
interface ScrollBack {
  (x: number, y: number): void;
}
type overflowType = '' | 'hidden';

/**
 * @since 2.0
 * @status experimental
 *
 * @dependency
 *
 * @event {{scrollLeft:number,scrollTop:number,value:number}} sl-scroll-y - Emitted when scroll y bar .
 * @event {{scrollLeft:number,scrollTop:number,value:number}} sl-scroll-x - Emitted when scroll x bar .
 * @event {{scrollLeft:number,scrollTop:number}} sl-scroll-y-end - Emitted when scroll y bar to end .
 * @event {{scrollLeft:number,scrollTop:number}} sl-scroll-x-end - Emitted when scroll x bar to end .
 * @event {{scrollLeft:number,scrollTop:number}} sl-scroll-change - Emitted when scroll  bar change .
 * @event resize  Emitted when component size  change
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 * @csspart content - The component's  scroll div.
 * @csspart content-wrap - The component's slot wrapper.
 *
 * @cssproperty --scroll-bar-width - scroll bar width.
 * @cssproperty --scroll-bar-outer-width - scroll bar-outer width.
 */
@customElement('sl-scroll')
export default class SlScroll extends LitElement {
  static styles = styles;
  /**
   * hidden, then the horizontal scrollbar is always hidden, otherwise it is automatically hidden according to the content
   */
  @property({ type: String, reflect: true, attribute: 'overflow-x' }) overflowX: overflowType = '';

  /**
   * hidden, then the vertical scrollbar is hidden, otherwise it is automatically shown hidden according to the content
   */
  @property({ type: String, reflect: true, attribute: 'overflow-y' }) overflowY: overflowType = '';
  /**
   * Whether or not to allow the keyboard to scroll up, down, left, and right keys
   */
  @property({ type: Boolean, reflect: true }) keyEnable: boolean = true;
  /**
   * Scroll bar width
   */
  @property({ type: Number, reflect: true, attribute: 'scroll-bar-width' }) scrollBarWidth: number = 8;
  /**
   * Scroll bar The width of the container, which must be greater than the width of the scroll bar
   */
  @property({ type: Number, reflect: true, attribute: 'scroll-bar-out-width' }) scrollBarOutWidth: number = 12;

  @property({ type: Number, attribute: false })
  /** Scroll bar min. */
  minScrollSize = 20;

  /** Define the scroll value size */
  @property({ attribute: false, type: Number })
  scrollItemValue = 30;

  @eventOptions({
    passive: false
  })
  private _wheelHander(e: WheelEvent) {
    const scrollObj = this;
    const changeYValue = e.deltaY;
    const changeXValue = e.deltaX;
    e.preventDefault();
    if (changeYValue !== undefined && changeYValue !== 0) {
      scrollObj.changeYScroll((changeYValue > 0 ? 1 : -1) * this.scrollItemValue);
    }
    if (changeXValue !== undefined && changeXValue !== 0) {
      scrollObj.changeXScroll((changeXValue > 0 ? 1 : -1) * this.scrollItemValue);
    }
  }
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _touchStartHanlder(event: TouchEvent) {
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  }
  private _touchMoveHanlder(event: TouchEvent) {
    const touch = event.touches[0];
    const newX = touch.clientX;
    const newY = touch.clientY;
    const changeX = this._touchStartX - newX;
    const changeY = this._touchStartY - newY;
    event.preventDefault();
    this.changeYScroll(changeY);
    this.changeXScroll(changeX);
  }

  render() {
    return html`<div part="base" id="container" style="--scroll-bar-width:${this.scrollBarWidth}px ; --scroll-bar-out-width:${this.scrollBarOutWidth}px">
      <div part="content" id="content" @mousewheel=${this._wheelHander} @touchmove=${this._touchMoveHanlder} @touchstart=${this._touchStartHanlder}>
        <div id="content-wrap" part="content-wrap">
          <slot id="contentSlot"></slot>
        </div>
      </div>
      <div part="scroll-y" id="scroll-y"><div part="scroll-y-handler"></div></div>
      <div part="scroll-x" id="scroll-x"><div part="scroll-x-handler"></div></div>
      <div part="right-bottom" id="right-bottom"></div>
    </div>`;
  }
  @query('#right-bottom', true)
  public rightBottom: HTMLElement;

  @query('#content', true)
  public contentDIV: HTMLDivElement;

  @query('#content-wrap', true)
  public content_wrap_DIV: HTMLDivElement;

  @query('#container', true)
  public containerDIV: HTMLDivElement;

  @query('div[part=scroll-y]', true)
  public partYScroll: HTMLDivElement;

  @query('div[part=scroll-y-handler]', true)
  public partYHandler: HTMLDivElement;

  @query('div[part=scroll-x]', true)
  public partXScroll: HTMLDivElement;

  @query('div[part=scroll-x-handler]', true)
  public partXHandler: HTMLDivElement;

  private _obersver: ResizeObserver | undefined;
  firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._intiKeyEvent();
    this._initScrollBarEvent();
    this.contentDIV.scrollTop = 0;
    this.contentDIV.scrollLeft = 0;
    this._obersver = new ResizeObserver(() => {
      this.resize();
    });
    this._obersver.observe(this);
    this._obersver.observe(this.content_wrap_DIV);
    this.renderRoot.querySelector('#contentSlot')?.addEventListener('slotchange', () => {
      this.resize();
    });
    this.resize();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._obersver?.unobserve(this.content_wrap_DIV);
    this._obersver?.unobserve(this);
    this._obersver = undefined;
    this.removeEventListener('mouseover', this._MouseOnEventHandler);
    this.removeEventListener('mouseout', this._MouseOutEventHandler);
    document.removeEventListener('keydown', this._docEventHandler);
  }

  private _isMouseOn = false;
  private _MouseOnEventHandler: EventListener;
  private _MouseOutEventHandler: EventListener;
  private _docEventHandler: EventListener;
  private _initScrollBarEvent() {
    const scrollObj = this;
    const dragFun = (scrollDiv: HTMLElement, callBackFun: ScrollBack) => {
      let x = 0;
      let y = 0;
      const handerDown = (event: MouseEvent) => {
        event.preventDefault();
        x = event.clientX;
        y = event.clientY;
        document.addEventListener('mousemove', handerMove);
        document.addEventListener('mouseup', handerUp);
      };
      const handerUp = (event: MouseEvent) => {
        event.preventDefault();
        x = y = 0;
        document.removeEventListener('mousemove', handerMove);
        document.removeEventListener('mouseup', handerUp);
      };
      const handerMove = (event: MouseEvent) => {
        event.preventDefault();
        const nX = event.clientX;
        const nY = event.clientY;
        callBackFun(nX - x, nY - y);
        x = nX;
        y = nY;
      };
      scrollDiv.addEventListener('mousedown', handerDown);
    };
    dragFun(scrollObj.partYHandler, (_x: number, y: number) => {
      scrollObj.changeYBarPosition(y);
    });
    dragFun(scrollObj.partXHandler, (x: number, _y: number) => {
      scrollObj.changeXBarPosition(x);
    });
  }
  private _intiKeyEvent() {
    this._MouseOnEventHandler = (_event: Event) => {
      this._isMouseOn = true;
    };
    this._MouseOutEventHandler = (_event: Event) => {
      this._isMouseOn = false;
    };
    this._docEventHandler = (event: KeyboardEvent) => {
      if (this._isMouseOn && this.keyEnable) {
        const key = event.key;
        let y = 0,
          x = 0;
        switch (key) {
          case 'ArrowDown':
            y = this.scrollItemValue;
            break;
          case 'ArrowUp':
            y = 0 - this.scrollItemValue;
            break;
          case 'ArrowLeft':
            x = 0 - this.scrollItemValue;
            break;
          case 'ArrowRight':
            x = this.scrollItemValue;
            break;
          default:
            break;
        }
        if (y !== 0) {
          this.changeYScroll(y);
        }
        if (x !== 0) {
          this.changeXScroll(x);
        }
      }
    };
    this.addEventListener('mouseover', this._MouseOnEventHandler);
    this.addEventListener('mouseout', this._MouseOutEventHandler);
    document.addEventListener('keydown', this._docEventHandler);
  }

  private _resizeDispachFun: () => void;
  /**
   * When a container, or child element, changes, the resize function and event are triggered
   */
  resize() {
    const container = this.containerDIV;
    const div = this.contentDIV;
    if (this.overflowY !== 'hidden') {
      container.classList.add('showYScroll');
    } else {
      container.classList.remove('showYScroll');
    }
    if (this.overflowX !== 'hidden') {
      container.classList.add('showXScroll');
    } else {
      container.classList.remove('showXScroll');
    }
    const elCompontent = this;
    if (!this._resizeDispachFun) {
      this._resizeDispachFun = throttle(() => {
        /**
         * resize event, when the container or child is released to change, then trigger
         */
        elCompontent.dispatchEvent(new CustomEvent('resize'));
      }, this.throttTime);
      this._resizeDispachFun();
    }
    if (div.scrollHeight > div.offsetHeight) {
      this.changeYScroll();
    } else {
      container.classList.remove('showYScroll');
    }

    if (div.scrollWidth > div.offsetWidth) {
      this.changeXScroll();
    } else {
      container.classList.remove('showXScroll');
    }
  }

  get caculateYBarHeight() {
    let result = 0;
    const contentDIV = this.contentDIV;
    const height = contentDIV.offsetHeight;
    const scrollHeight = contentDIV.scrollHeight;
    if (scrollHeight > height) {
      const rate = height / scrollHeight;
      result = rate * height;
      if (result < this.minScrollSize) {
        result = this.minScrollSize;
      }
    }
    this.partYHandler.style.height = result + 'px';
    return result;
  }
  get caculateXBarWidth() {
    let result = 0;
    const contentDIV = this.contentDIV;
    const width = this.offsetWidth;
    const scrollWidth = contentDIV.scrollWidth;
    if (scrollWidth > width) {
      const rate = width / scrollWidth;
      result = rate * width;
      if (result < this.minScrollSize) {
        result = this.minScrollSize;
      }
    }
    this.partXHandler.style.width = result + 'px';
    return result;
  }
  caculateYBarPosition() {
    const contentDIV = this.contentDIV;
    const height = contentDIV.offsetHeight;
    const scrollHeight = contentDIV.scrollHeight;
    if (scrollHeight <= height) {
      this.partYHandler.style.top = '0';
      return 0;
    } else {
      const barHeight = this.caculateYBarHeight;
      const canScrollDIVHeight = this.partYScroll.offsetHeight - barHeight;
      const topHeight = (contentDIV.scrollTop / (scrollHeight - height)) * canScrollDIVHeight;
      this.partYHandler.style.top = topHeight + 'px';
      return topHeight;
    }
  }

  caculateXBarPosition() {
    const contentDIV = this.contentDIV;
    const width = contentDIV.offsetWidth;
    const scrollWidth = contentDIV.scrollWidth;
    if (scrollWidth <= width) {
      this.partXHandler.style.left = '0';
      return 0;
    } else {
      const barWidth = this.caculateXBarWidth;
      const canScrollDIVHeight = this.partXScroll.offsetWidth - barWidth;
      const topWidth = (contentDIV.scrollLeft / (scrollWidth - width)) * canScrollDIVHeight;
      this.partXHandler.style.left = topWidth + 'px';
      return topWidth;
    }
  }

  private _yDispatchMethod?: (oldValue: number, newValue: number) => void;
  private _xDispatchMethod?: (oldValue: number, newValue: number) => void;

  protected get xDispatchMethod() {
    if (this._xDispatchMethod === undefined) {
      const d = (oldValue: number, newValue: number) => {
        /**
         * Triggered when scrolling horizontally detail.value Horizontal scroll size of content area detail.oldValue Horizontal scroll size of original content area
         */
        this._emitEvent('scroll-x', {
          value: newValue,
          oldValue: oldValue
        });
      };
      this._xDispatchMethod = throttle(d, this.throttTime);
    }
    return this._xDispatchMethod;
  }

  protected get yDispatchMethod() {
    if (this._yDispatchMethod === undefined) {
      const d = (oldValue: number, newValue: number) => {
        /**
         * Triggered when scrolling horizontally detail.value Horizontal scroll size of content area detail.oldValue Horizontal scroll size of original content area
         */
        this._emitEvent('scroll-y', {
          value: newValue,
          oldValue: oldValue
        });
      };
      this._yDispatchMethod = throttle(d, this.throttTime);
    }
    return this._yDispatchMethod;
  }
  private _emitEvent(eventName: string, obj?: {}) {
    emit(this, `sl-${eventName}`, {
      detail: {
        ...obj,
        scrollTop: this.contentDIV.scrollTop,
        scrollLeft: this.contentDIV.scrollLeft
      }
    });
  }
  private _scrollDispatchMethod?: () => void;
  protected get scrollDispatchMethod() {
    if (this._scrollDispatchMethod === undefined) {
      const d = () => {
        /**
         *  The scroll event, detail scrollTop,detail scrollLeft, describes the content scrolling position,
         */
        this._emitEvent('scroll-change');
      };
      this._scrollDispatchMethod = throttle(d, this.throttTime);
    }
    return this._scrollDispatchMethod;
  }
  private _scrollEvent() {
    this.scrollDispatchMethod();
  }
  /**
   *
   * @param scrollValue Change vertical content scrolling position
   */
  changeYScroll(scrollValue: number = 0) {
    const contentDIV = this.contentDIV;
    const height = contentDIV.offsetHeight;
    const scrollHeight = contentDIV.scrollHeight;
    const maxScroll = scrollHeight - height;
    const oldScrollTop = contentDIV.scrollTop;
    let scrollTop = oldScrollTop;
    if (oldScrollTop > maxScroll) {
      scrollTop = maxScroll;
    }
    scrollTop += scrollValue;
    if (scrollTop > maxScroll) {
      scrollTop = maxScroll;
    }
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    contentDIV.scrollTop = scrollTop;
    this.caculateYBarPosition();
    if (oldScrollTop !== scrollTop) {
      if (scrollTop === maxScroll) {
        /**
         *  Triggered when scrolling vertically to the bottom, detail.value, content scroll height
         */
        this._emitEvent('scroll-y-end', {
          detail: {
            value: scrollTop
          }
        });
      }
      this.yDispatchMethod(oldScrollTop, scrollTop);
      this._scrollEvent();
    }
  }
  /**
   * Event throttling time
   */
  @property({ type: Number })
  public throttTime: number = 20;
  /**
   * Change horizontal content scrolling position
   * @param scrollValue How much to change
   */
  changeXScroll(scrollValue: number = 0) {
    const contentDIV = this.contentDIV;
    const width = contentDIV.offsetWidth;
    const scrollWidth = contentDIV.scrollWidth;
    const maxScroll = scrollWidth - width;
    const oldScrollLeft = contentDIV.scrollLeft;
    let scrollLeft = oldScrollLeft;
    if (oldScrollLeft > maxScroll) {
      scrollLeft = maxScroll;
    }
    scrollLeft += scrollValue;
    if (scrollLeft > maxScroll) {
      scrollLeft = maxScroll;
    }
    if (scrollLeft < 0) {
      scrollLeft = 0;
    }
    contentDIV.scrollLeft = scrollLeft;
    this.caculateXBarPosition();
    if (oldScrollLeft !== scrollLeft) {
      if (scrollLeft === maxScroll) {
        /**
         * Scroll horizontally to the rightmost trigger * detail.value Content horizontal scroll size
         */
        this._emitEvent('scroll-x-end', {
          value: scrollLeft
        });
      }
      this.xDispatchMethod(oldScrollLeft, scrollLeft);
      this._scrollEvent();
    }
  }
  /**
   * Change vertical scrolling to enlarge the position
   *  @param changeValue Change value of vertical scroll bar, >0 Down
   */
  changeYBarPosition(changeValue: number = 0) {
    const contentDIV = this.contentDIV;
    let scrollTop = parseInt(getCssValue(this.partYHandler, 'top'), 10);
    const barHeight = this.caculateYBarHeight;
    const offsetheight = contentDIV.offsetHeight;
    const contentScrollHeight = contentDIV.scrollHeight - offsetheight;
    const maxScrollTop = contentScrollHeight > 0 ? this.partYScroll.offsetHeight - barHeight : 0;
    scrollTop += changeValue;
    if (scrollTop > maxScrollTop) {
      scrollTop = maxScrollTop;
    }
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    this.partYHandler.style.top = scrollTop + 'px';
    if (contentScrollHeight > 0) {
      const canScrollDIVHeight = this.partYScroll.offsetHeight - barHeight;
      const contentScrollTopValue = (scrollTop * (contentDIV.scrollHeight - offsetheight)) / canScrollDIVHeight;
      this.scrollYToValue(contentScrollTopValue);
    } else {
      this.scrollYToValue(0);
    }
  }
  /**
   * Change the position of the horizontal scroll bar
   * @param changeValue Size of change
   */
  changeXBarPosition(changeValue: number = 0) {
    const contentDIV = this.contentDIV;
    let scrollLeft = parseInt(getCssValue(this.partXHandler, 'left'), 10);
    const barWidth = this.caculateXBarWidth;
    const offsetWidth = contentDIV.offsetWidth;
    const contentScrollWidth = contentDIV.scrollWidth - contentDIV.offsetWidth;
    const maxScrollTop = contentScrollWidth > 0 ? this.partXScroll.offsetWidth - barWidth : 0;
    scrollLeft += changeValue;
    if (scrollLeft > maxScrollTop) {
      scrollLeft = maxScrollTop;
    }
    if (scrollLeft < 0) {
      scrollLeft = 0;
    }
    this.partXHandler.style.left = scrollLeft + 'px';
    if (contentScrollWidth > 0) {
      const canScrollDIVWidth = offsetWidth - barWidth;
      const contentScrollValue = (scrollLeft * (contentDIV.scrollWidth - offsetWidth)) / canScrollDIVWidth;
      this.scrollXToValue(contentScrollValue);
    } else {
      this.scrollXToValue(0);
    }
  }
  /**
   * Vertical scroll bar Scroll to the bottom
   */
  scrollYToEnd() {
    const contentDIV = this.contentDIV;
    const offsetHeight = contentDIV.offsetHeight;
    const maxScrollTop = contentDIV.scrollHeight - offsetHeight;
    this.changeYScroll(maxScrollTop - contentDIV.scrollTop);
  }
  /**
   * Scroll vertical content to a specific position
   * @param scrollTop
   */
  scrollYToValue(scrollTop: number = 0) {
    const currentTop = this.contentDIV.scrollTop;
    this.changeYScroll(scrollTop - currentTop);
  }
  /**
   * Horizontal scroll bar scrolls to the far right
   */
  scrollXToEnd() {
    const contentDIV = this.contentDIV;
    const offsetWidth = contentDIV.offsetWidth;
    const maxScrollTop = contentDIV.scrollWidth - offsetWidth;
    this.changeXScroll(maxScrollTop - contentDIV.scrollLeft);
  }
  /**
   *
   * @param scrollLeft Horizontal content scrolling to a specific position
   */
  scrollXToValue(scrollLeft: number = 0) {
    const currentLeft = this.contentDIV.scrollLeft;
    this.changeXScroll(scrollLeft - currentLeft);
  }
  update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    if (changedProperties.has('throttTime')) {
      this._xDispatchMethod = undefined;
      this._yDispatchMethod = undefined;
      this._scrollDispatchMethod = undefined;
    }
  }
  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    if (_changedProperties.has('overflowX') || _changedProperties.has('overflowY') || _changedProperties.has('scrollBarWidth') || _changedProperties.has('scrollBarOutWidth')) {
      this.resize();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-scroll': SlScroll;
  }
}
