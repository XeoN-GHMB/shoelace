import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AriaRole } from '../../internal/ArialRole';
import { getOpacity, normalizePointerEvent } from '../../internal/event';
import { watch } from '../../internal/watch';
import { addEvent } from '../../utilities/common';
import { getTransformPara } from '../../utilities/getTransParam';
import { DisposeObject } from '../../utilities/resize.util';
import styles from './ripple.styles';

/**
 * thanks weightless !see https://github.com/andreasbm/weightless/blob/master/src/lib/ripple/ripple.ts
 *
 */
/**
 * Base properties of the ripple. Used when showing a ripple.
 */
export interface IRippleBaseProperties {
  autoRelease: boolean;
  initialDuration: number;
  releaseDuration: number;
}

/**
 * Properties of the ripple.
 */
export interface IRippleProperties extends IRippleBaseProperties {
  target: EventTarget;
  overlay: boolean;
  disabled: boolean;
  unbounded: boolean;
  centered: boolean;
  focusable: boolean;
  role: AriaRole;
}

/**
 * Configuration when showing a ripple.
 */
export interface IRippleConfig extends IRippleBaseProperties {}

/**
 * Base configuration for the ripple animation.
 */
export const RIPPLE_ANIMATION_CONFIG: KeyframeAnimationOptions = {
  easing: 'ease-out',
  fill: 'both'
};
export function computeRadius(a: number, b: number) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) / 2;
}
/**
 * Initial animation duration.
 */
export const RIPPLE_INITIAL_DURATION = 350;

/**
 * Release animation duration.
 */
export const RIPPLE_RELEASE_DURATION = 500;

const DISPOSEOBJ = {
  dispose() {}
};

/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 * @event sl-ripple-end - Emitted when ripple effect end
 *
 * @slot - The default slot wrap node for ripplie effect.
 * @cssprop --ripple-color - Color.
 * @cssprop --ripple-opacity - Opacity.
 *
 * @cssproperty --sl-ripple-color - An ripple animate background color
 */
@customElement('sl-ripple')
export default class SlRipple extends LitElement {
  static styles = styles;

  /**
   * Makes the ripple visible outside the bounds.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) unbounded: boolean = false;

  /**
   * Makes ripple appear from the center.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) centered: boolean = false;

  /**
   * Overlays the ripple.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) overlay: boolean = false;

  /**
   * Disables the ripple.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  /**
   * Allows focusin to spawn a ripple.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) focusable: boolean = false;

  /**
   * Releases the ripple after it has been spawned.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) autoRelease: boolean = false;

  /**
   * Initial animation duration.
   * @attr
   */
  @property({ type: Number }) initialDuration: number = RIPPLE_INITIAL_DURATION;

  /**
   * Fade out animation duration.
   * @attr
   */
  @property({ type: Number }) releaseDuration: number = RIPPLE_RELEASE_DURATION;

  /**
   * Role of the ripple.
   * @attr
   */
  @property({ type: String, reflect: true }) role: AriaRole = 'presentation';

  /**
   * Target for the spawn ripple events.
   * @attr
   */
  @property({ type: Object }) target: EventTarget = this;

  private listeners: Array<DisposeObject> = [];
  private rippleAnimationListeners: Array<DisposeObject> = [];
  @watch('target')
  changeTarget() {
    this.listeners.forEach(item => item.dispose());
    if (this.target) {
      this.listeners = [];
      const mousedown = addEvent(this.target, 'mousedown', (e: MouseEvent) => this.spawnRipple(e), { passive: true });
      const focusin = addEvent(this.target, 'focusin', this.onFocusIn.bind(this), { passive: true });
      const focusout = addEvent(this.target, 'focusout', this.onFocusOut.bind(this), { passive: true });
      this.listeners.concat(mousedown, focusin, focusout);
    }
  }

  firstUpdate(map: PropertyValues) {
    super.firstUpdated(map);
    this.changeTarget();
  }
  /**
   * Add a persistent ripple when the taget gains focus.
   */
  protected onFocusIn() {
    if (!this.focusable) return;
    this.spawnRipple(undefined, { autoRelease: false });
  }

  /**
   * Release the current ripple when the focus is lost from the target.
   */
  protected onFocusOut() {
    if (!this.focusable) return;
    this.releaseRipple();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.listeners.forEach(item => item.dispose());
    this.rippleAnimationListeners.forEach(item => item.dispose());
  }

  releaseRipple() {
    this.rippleAnimationListeners.forEach(item => item.dispose());
    this.rippleAnimationListeners = [];
  }

  /**
   * Handles the mouse down events and spawns a ripple.
   * If no event is provided the ripple will spawn in the center.
   * @param {MouseEvent | TouchEvent} e
   * @param config
   */
  spawnRipple(e?: MouseEvent | TouchEvent, config?: Partial<IRippleConfig>): DisposeObject {
    // Check if the ripple is disabled
    if (this.disabled) {
      // Return an empty noop function
      return DISPOSEOBJ;
    }

    // Release the existing ripple if there is one
    this.releaseRipple();

    // Compute the spawn coordinates for the ripple
    const rect = this.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if (this.centered || e == null) {
      x = rect.width / 2;
      y = rect.height / 2;
    } else {
      let { clientX, clientY } = normalizePointerEvent(e);
      x = clientX - rect.left;
      y = clientY - rect.top;
    }

    // Show the ripple and store the release function
    const release = this.showRippleAtCoords({ x, y }, config);
    this.rippleAnimationListeners.push(release);
    // Only if the target is present or if the ripple is NOT focusable we attach the release listeners.
    if (this.target != null && !this.focusable) {
      this.rippleAnimationListeners.push(addEvent(window, 'mouseup', this.releaseRipple.bind(this), { passive: true }));
    }
    return release;
  }
  async showRipple() {
    this.spawnRipple();
    await this.updateComplete;
    this.releaseRipple();
  }

  /**
   * Shows a ripple at a specific coordinate.
   * @param number
   * @param config
   */
  showRippleAtCoords({ x, y }: { x: number; y: number }, config?: Partial<IRippleConfig>) {
    const { releaseDuration = this.releaseDuration, initialDuration = this.initialDuration, autoRelease = this.autoRelease } = config || {};
    const { offsetWidth, offsetHeight } = this;
    const scale = getTransformPara(this);
    // Add the scale in case the ripple is transformed
    x *= scale.ScaleX === 0 ? 1 : 1 / scale.ScaleX;
    y *= scale.ScaleY === 0 ? 1 : 1 / scale.ScaleY;
    // Create the ripple
    const $ripple = document.createElement('div');
    $ripple.classList.add('ripple');

    // Compute distance from the center of the rectangle (container) to its corner.
    // If the coords are in the center the ripple would fill the entire container.
    const containerRadius = computeRadius(offsetWidth, offsetHeight);

    // Compute the additional distance we have to add to the radius to make sure it always fills
    // the entire container. The extra distance will be the distance from the center to the coords.
    // If the coords are in the middle the extra radius will be 0.
    const extraRadius = computeRadius(Math.abs(offsetWidth / 2 - x), Math.abs(offsetHeight / 2 - y));

    // The size of the ripple is the diameter
    const radius = Math.round(containerRadius + extraRadius * 2);
    const diameter = radius * 2;

    // Assign the styles that makes it spawn from the desired coords
    Object.assign($ripple.style, {
      left: `${x - radius}px`,
      top: `${y - radius}px`,
      height: `${diameter}px`,
      width: `${diameter}px`,
      position: 'absolute'
    });

    // Cleans up the ripple
    let released = false;
    const release = {
      dispose: () => {
        if (released) return;
        released = true;
        // Fade the ripple out
        const opacity = getOpacity(window.getComputedStyle($ripple));
        const outAnimation = $ripple.animate(
          <PropertyIndexedKeyframes>{
            opacity: [opacity.toString(), `0`]
          },
          { ...RIPPLE_ANIMATION_CONFIG, duration: releaseDuration }
        );
        // When the out animation finished we remove the ripple before the next frame
        outAnimation.onfinish = () => {
          requestAnimationFrame(() => {
            if (this.shadowRoot!.contains($ripple)) {
              this.shadowRoot!.removeChild($ripple);
            }
          });
        };
      }
    };

    // Start the animation and add the ripple to the DOM
    this.shadowRoot!.appendChild($ripple);

    // Release instantly if autorelease
    if (autoRelease) {
      release.dispose();
      return DISPOSEOBJ;
    }

    // Scale the ripple in
    $ripple.animate(
      <PropertyIndexedKeyframes>{
        transform: [`scale(0)`, `scale(1)`]
      },
      { ...RIPPLE_ANIMATION_CONFIG, duration: initialDuration }
    );

    return release;
  }

  render() {
    return this.target == this ? html`<slot></slot>` : html``;
  }

  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-ripple': SlRipple;
  }
}
