import {
  animations
} from "./chunk.TJOP7HQP.js";
import {
  watch
} from "./chunk.BD26TKS4.js";
import {
  emit
} from "./chunk.53VVVNUW.js";
import {
  component_styles_default
} from "./chunk.L3YJYC74.js";
import {
  __decorateClass
} from "./chunk.YTC2GCNT.js";

// src/components/animation/animation.ts
import { LitElement, html } from "lit";
import { customElement, property, queryAsync } from "lit/decorators.js";

// src/components/animation/animation.styles.ts
import { css } from "lit";
var animation_styles_default = css`
  ${component_styles_default}

  :host {
    display: contents;
  }
`;

// src/components/animation/animation.ts
var SlAnimation = class extends LitElement {
  constructor() {
    super(...arguments);
    this.hasStarted = false;
    this.name = "none";
    this.play = false;
    this.delay = 0;
    this.direction = "normal";
    this.duration = 1e3;
    this.easing = "linear";
    this.endDelay = 0;
    this.fill = "auto";
    this.iterations = Infinity;
    this.iterationStart = 0;
    this.playbackRate = 1;
  }
  get currentTime() {
    var _a;
    return ((_a = this.animation) == null ? void 0 : _a.currentTime) || 0;
  }
  set currentTime(time) {
    if (this.animation) {
      this.animation.currentTime = time;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.createAnimation();
    this.handleAnimationCancel = this.handleAnimationCancel.bind(this);
    this.handleAnimationFinish = this.handleAnimationFinish.bind(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.destroyAnimation();
  }
  async handleAnimationChange() {
    if (!this.hasUpdated) {
      return;
    }
    this.createAnimation();
  }
  handleAnimationFinish() {
    this.play = false;
    this.hasStarted = false;
    emit(this, "sl-finish");
  }
  handleAnimationCancel() {
    this.play = false;
    this.hasStarted = false;
    emit(this, "sl-cancel");
  }
  handlePlayChange() {
    if (this.animation) {
      if (this.play && !this.hasStarted) {
        this.hasStarted = true;
        emit(this, "sl-start");
      }
      this.play ? this.animation.play() : this.animation.pause();
      return true;
    } else {
      return false;
    }
  }
  handlePlaybackRateChange() {
    if (this.animation) {
      this.animation.playbackRate = this.playbackRate;
    }
  }
  handleSlotChange() {
    this.destroyAnimation();
    this.createAnimation();
  }
  async createAnimation() {
    const easing = animations.easings[this.easing] || this.easing;
    const keyframes = this.keyframes ? this.keyframes : animations[this.name];
    const slot = await this.defaultSlot;
    const element = slot.assignedElements()[0];
    if (!element) {
      return false;
    }
    this.destroyAnimation();
    this.animation = element.animate(keyframes, {
      delay: this.delay,
      direction: this.direction,
      duration: this.duration,
      easing,
      endDelay: this.endDelay,
      fill: this.fill,
      iterationStart: this.iterationStart,
      iterations: this.iterations
    });
    this.animation.playbackRate = this.playbackRate;
    this.animation.addEventListener("cancel", this.handleAnimationCancel);
    this.animation.addEventListener("finish", this.handleAnimationFinish);
    if (this.play) {
      this.hasStarted = true;
      emit(this, "sl-start");
    } else {
      this.animation.pause();
    }
    return true;
  }
  destroyAnimation() {
    if (this.animation) {
      this.animation.cancel();
      this.animation.removeEventListener("cancel", this.handleAnimationCancel);
      this.animation.removeEventListener("finish", this.handleAnimationFinish);
      this.hasStarted = false;
    }
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (e) {
    }
  }
  finish() {
    try {
      this.animation.finish();
    } catch (e) {
    }
  }
  render() {
    return html` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
SlAnimation.styles = animation_styles_default;
__decorateClass([
  queryAsync("slot")
], SlAnimation.prototype, "defaultSlot", 2);
__decorateClass([
  property()
], SlAnimation.prototype, "name", 2);
__decorateClass([
  property({ type: Boolean, reflect: true })
], SlAnimation.prototype, "play", 2);
__decorateClass([
  property({ type: Number })
], SlAnimation.prototype, "delay", 2);
__decorateClass([
  property()
], SlAnimation.prototype, "direction", 2);
__decorateClass([
  property({ type: Number })
], SlAnimation.prototype, "duration", 2);
__decorateClass([
  property()
], SlAnimation.prototype, "easing", 2);
__decorateClass([
  property({ attribute: "end-delay", type: Number })
], SlAnimation.prototype, "endDelay", 2);
__decorateClass([
  property()
], SlAnimation.prototype, "fill", 2);
__decorateClass([
  property({ type: Number })
], SlAnimation.prototype, "iterations", 2);
__decorateClass([
  property({ attribute: "iteration-start", type: Number })
], SlAnimation.prototype, "iterationStart", 2);
__decorateClass([
  property({ attribute: false })
], SlAnimation.prototype, "keyframes", 2);
__decorateClass([
  property({ attribute: "playback-rate", type: Number })
], SlAnimation.prototype, "playbackRate", 2);
__decorateClass([
  watch("name"),
  watch("delay"),
  watch("direction"),
  watch("duration"),
  watch("easing"),
  watch("endDelay"),
  watch("fill"),
  watch("iterations"),
  watch("iterationsStart"),
  watch("keyframes")
], SlAnimation.prototype, "handleAnimationChange", 1);
__decorateClass([
  watch("play")
], SlAnimation.prototype, "handlePlayChange", 1);
__decorateClass([
  watch("playbackRate")
], SlAnimation.prototype, "handlePlaybackRateChange", 1);
SlAnimation = __decorateClass([
  customElement("sl-animation")
], SlAnimation);
var animation_default = SlAnimation;

export {
  animation_default
};
