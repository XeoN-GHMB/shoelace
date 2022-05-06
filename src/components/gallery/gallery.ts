import { LitElement, html, TemplateResult, svg, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { emit } from '../../internal/event';
import { watch } from '../../internal/watch';
import { addEvent, exitFullscreen, fullscreen, getCssValue, isFullscreen } from '../../utilities/common';
import { addResizeHander, DisposeObject } from '../../utilities/resize.util';
import styles from './gallery.styles';

const svgLeft = svg`<svg class="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
const svgRight = svg`<svg class="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
const svgPause = svg`<svg class="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
const svgPaused = svg`<svg class="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
const svgFullscreened = svg`<svg class="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`;
const svgFullscreen = svg`<svg class="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;
/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 * @event {{value:number,toValue:number}} sl-gallery-before-change - Emitted when before change the current image index .
 * @event {{value:number}} sl-gallery-change - Emitted current image index changed.
 * @event {{image:Image}} sl-gallery-image-load - Emitted  image load.
 * @event {{image:Image}} sl-gallery-image-click - Emitted  image click.
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 * @csspart images - The real images container.
 * @csspart thumbs - The thumb images container.
 * @csspart image - The current image to display.
 * @csspart left-nav - The left nav button.
 * @csspart right-nav - The right nav button.
 * @csspart nav-button - The smal nav-button
 * @csspart thumb-image - The thums inner images
 *
 *
 *
 * @cssproperty --thumb-image-size -  thumb-images size default 100px .
 * @cssproperty --sl-image-transition-time: --transition time  default 450ms - .
 */
@customElement('sl-gallery')
export default class SlGallery extends LitElement {
  static styles = styles;

  /** Image path. */
  @property({ type: Array }) images: Array<string>;
  /** Thumbnail image path, if not set, the default is images */
  @property({ type: Array }) thumb_images?: Array<string>;
  @property({ type: Number }) currentIndex = 0;

  /**Thumbnail display position */
  @property({ type: String, attribute: 'thumb-position' }) thumbPosition: 'bottom' | 'left' | 'top' | 'right' = 'bottom';

  /** Image for other other data */
  @property({ type: Array }) image_datas: Array<unknown> = [];
  /**Current image custom display   */
  @property({ type: Object }) imageRender?: (this: SlGallery, image_data: unknown, index: number) => TemplateResult<1>;

  /** Whether to display the pause button  */
  @property({ type: Boolean, attribute: false }) show_pause = true;

  /** Whether to delay loading images */
  @property({ type: Boolean, attribute: false }) layImage = false;

  /** Whether to automatically switch the display picture */
  @property({ type: Boolean, attribute: false }) autoPlay = false;
  /**Automatic switching time */
  @property({ type: Number, attribute: false }) autoPlaytimes = 2000;

  private _intervalTimeID?: number;
  /** Whether to display the full screen button  */
  @property({ type: Boolean, attribute: false }) show_fullscreen = true;

  /** Whether to display the left/right toggle button  */
  @property({ type: Boolean, attribute: false }) showNavButtons = true;

  /** The global left,right keys can be used to adjust the current image */
  @property({ type: Boolean, attribute: false }) windowKeyEnable = false;

  /** Full screen or not :Internal use */
  @state() isFullScreened = false;

  @watch('autoPlay')
  watchAutoPlay() {
    if (this.autoPlay) {
      if (this._intervalTimeID) {
        window.clearInterval(this._intervalTimeID);
        this._intervalTimeID = undefined;
      }
      this._intervalTimeID = window.setInterval(() => {
        this.goImageByChange(1);
      }, this.autoPlaytimes);
    } else {
      if (this._intervalTimeID) {
        window.clearInterval(this._intervalTimeID);
        this._intervalTimeID = undefined;
      }
    }
  }
  private _windowKeyHander?: DisposeObject;

  // @ts-ignore
  @watch('windowKeyEnable')
  private keyEnableChange() {
    this._windowKeyHander?.dispose();
    this._windowKeyHander = addEvent(this.windowKeyEnable ? window : this, 'keydown', (event: KeyboardEvent) => {
      let change = 0;
      const key = event.key;
      switch (key) {
        case 'ArrowRight':
        case 'ArrowDown':
          change++;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          change--;
          break;
      }
      if (change != 0) {
        this.goImageByChange(change);
      }
    });
  }
  /** 根据相对位置调整 当前显示的图片 */
  private goImageByChange(changeNumber: number) {
    let index = this.currentIndex + changeNumber;
    if (index + 1 > this.images.length) {
      index = 0;
    } else if (index < 0) {
      index = this.images.length - 1;
    }
    const eventResult = emit(this, 'sl-gallery-before-change', {
      detail: {
        value: this.currentIndex,
        toValue: index
      }
    });
    if (!eventResult.defaultPrevented) {
      this.currentIndex = index;
      emit(this, 'sl-gallery-change', {
        detail: {
          value: this.currentIndex
        }
      });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._intervalTimeID) {
      window.clearInterval(this._intervalTimeID);
      this._intervalTimeID = undefined;
    }
    this._windowKeyHander?.dispose();
    this._resizeRemoveAbleObj?.dispose();
  }

  @watch('images')
  watchChangeImages() {
    if (!this.thumb_images || this.thumb_images.length != this.images.length) {
      this.thumb_images = [...this.images];
    }
  }
  @state()
  private _loadedOneImage = false;
  /** Rendering Toggle picture buttons left and right */
  private renderNavLefAndRight() {
    return this._loadedOneImage && this.showNavButtons
      ? html`
          <button class="nav-button left-nav" part="left-nav" @click=${() => this.goImageByChange(-1)}>${svgLeft}</button>
          <button class="nav-button right-nav" part="right-nav" @click=${() => this.goImageByChange(1)}>${svgRight}</button>
        `
      : nothing;
  }

  /** Rendering thumbimages */
  private renderThumbimages() {
    const to = this.thumb_images?.map((item, index) => {
      return html`<button part="thumb-button" @click=${() => this.goImageByChange(index - this.currentIndex)} class="thumb-button " ?current-image=${this.currentIndex == index}>
        <img part="thumb-image" class="thumb-image" .src=${item} />
      </button>`;
    });
    return html`<div class="thumb-image-conatainer" id="thumb-image-conatainer">${this._loadedOneImage ? to : nothing}</div>`;
  }

  /** Rendering images*/
  private renderImages() {
    const itemRender = (item: string, index: number) => {
      return html`<div>
        ${!this.layImage || Math.abs(this.currentIndex - index) <= 1
          ? html`<img
              @load=${(event: Event) => {
                this._loadedOneImage = true;
                emit(this, 'sl-gallery-image-load', {
                  detail: { image: event.target as HTMLImageElement }
                });
              }}
              @click=${(event: Event) => {
                emit(this, 'sl-gallery-image-click', {
                  detail: { image: event.target as HTMLImageElement }
                });
              }}
              part="images"
              class="image-gallery-image"
              .src=${item}
              alt=""
              srcset=""
              title=""
            />`
          : nothing}
        ${index == this.currentIndex && this.imageRender && this.image_datas ? html`<div part="image-exta">${this.imageRender?.call(this, this.image_datas[index], index)}</div>` : nothing}
      </div>`;
    };
    const to = this.images?.map((item, index) => {
      return html`<div
        aria-label="Go to Slide ${index}"
        tabindex="-1"
        style="transform: translate3d(${100 * (index - this.currentIndex)}%, 0px, 0px);transition: all var(--sl-image-transition-time) ease-out 0s;"
        class="image-gallery-slide"
        ?current-image=${this.currentIndex == index}
      >
        ${itemRender(item, index)}
      </div>`;
    });
    return html`<div class="image-sliders">${to}</div>`;
  }
  private renderImgeNavigations() {
    if (!this._loadedOneImage) {
      return nothing;
    }
    return html`<div class="imgage-navigation" part="image-naviagation">
      <div class="imgage-navigation-wrap" part="image-naviagation-wrap">
        ${this.images?.map((_item, index) => {
          return html`<button ?current-image=${index == this.currentIndex} part="nav-button" @click=${() => this.goImageByChange(index - this.currentIndex)}></button>`;
        })}
      </div>
    </div>`;
  }
  private renderPauseButton() {
    if (!this._loadedOneImage) {
      return nothing;
    }
    return this.show_pause
      ? html`<button
          class="nav-button button-pauseButton"
          @click=${() => {
            this.autoPlay = !this.autoPlay;
            this.goImageByChange(1);
          }}
          part="pauseButon"
        >
          ${!this.autoPlay ? svgPause : svgPaused}
        </button>`
      : '';
  }
  private renderFullScreenButton() {
    if (!this._loadedOneImage) {
      return nothing;
    }
    return this.show_fullscreen ? html`<button class="nav-button button-fullscreen" @click=${this.changeFullScreenState} part="full-screen">${this.isFullScreened ? svgFullscreened : svgFullscreen}</button>` : '';
  }
  /**
   * Change component full screen state
   */
  public changeFullScreenState() {
    if (isFullscreen()) {
      exitFullscreen();
      this.isFullScreened = false;
    } else {
      fullscreen(this);
      this.isFullScreened = true;
    }
  }

  private caculateThumbPotion() {
    const thumbs = this.renderRoot.querySelector('div.thumbs') as HTMLElement;
    const thumbContainer = thumbs?.querySelector('div.thumb-image-conatainer') as HTMLElement;
    if (thumbContainer) {
      if (this.thumbPosition == 'bottom' || this.thumbPosition == 'top') {
        thumbContainer.style.height = 'auto';
        let scroll = thumbContainer.scrollWidth - thumbContainer.offsetWidth;
        let scrollWidth = 0;
        if (scroll > 0 && this.thumb_images && this.thumb_images.length > 0) {
          scrollWidth = (scroll / (this.thumb_images.length - 1)) * this.currentIndex;
        }
        thumbContainer.style.transform = `translate3d(-${scrollWidth}px,0px, 0px) `;
      } else if (this.thumbPosition == 'left' || this.thumbPosition == 'right') {
        const silders = this.renderRoot.querySelector('div.image-sliders') as HTMLElement;
        thumbContainer.style.height = Math.min(parseInt(getCssValue(silders, 'height')), parseInt(getCssValue(silders.parentElement as HTMLElement, 'height'))) + 'px';
        let scroll = thumbContainer.scrollHeight - thumbContainer.offsetHeight;
        let scrollHeight = 0;
        if (scroll > 0 && this.thumb_images && this.thumb_images.length > 0) {
          scrollHeight = (scroll / (this.thumb_images.length - 1)) * this.currentIndex;
        }
        thumbContainer.style.justifyContent = scroll > 0 ? 'flex-start' : 'center';
        thumbContainer.style.transform = `translate3d(0px,-${scrollHeight}px, 0px)`;
      }
    }
  }
  private _resizeRemoveAbleObj: DisposeObject;
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
    this.watchAutoPlay();
    this.caculateThumbPotion();
    this.keyEnableChange();
    const thumbs = this.renderRoot.querySelector('div[part=thumbs]') as HTMLElement;
    this._resizeRemoveAbleObj = addResizeHander([this, thumbs.querySelector('#thumb-image-conatainer') as HTMLElement], (_el: Element) => {
      this.caculateThumbPotion();
    });
  }
  updated(map: PropertyValues) {
    super.updated(map);
    if (!this.hasUpdated) {
      return;
    }
    this.caculateThumbPotion();
  }
  render() {
    return html`
      <div part="base" class=" base ${this.thumbPosition} ${this.isFullScreened ? 'full-screen' : ''}">
        <div part="images" class="images">
          ${this.renderImages()} ${this.renderNavLefAndRight()} ${this.renderImgeNavigations()} ${this.renderPauseButton()} ${this.renderFullScreenButton()}
          <slot></slot>
        </div>
        <div part="thumbs" class="thumbs">${this.renderThumbimages()}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-gallery': SlGallery;
  }
}
