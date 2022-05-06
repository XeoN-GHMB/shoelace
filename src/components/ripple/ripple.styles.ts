import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host {
    position: relative;
    outline: none;
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  /* Color */
  /* Opacity */
  :host(:not([unbounded])) {
    overflow: hidden;
  }

  :host([overlay]) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    transform: translate(-50%, -50%);
  }

  .ripple {
    background: var(--ripple-color, currentcolor);
    opacity: var(--ripple-opacity, 0.15);
    border-radius: 100%;
    pointer-events: none;
    will-change: opacity, transform;
  }
`;
