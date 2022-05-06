import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

//language=CSS
export default css`
  ${componentStyles}

  :host {
    --indicator-color: var(--sl-color-primary-600);
    --dot-width: calc(1em / 4);
    --speed: 1s;
  }

  .loader {
    position: relative;
    display: block;
    width: calc(var(--dot-width) * 4);
    height: calc(var(--dot-width) * 4);
  }
  .loader span:nth-child(1) {
    --i: 0;
  }

  .loader span:nth-child(2) {
    --i: 1;
    left: calc(50% - (50% / 4));
  }
  .loader span:nth-child(3) {
    --i: 2;
    left: calc(100% - (50% / 4) * 2);
  }
  .loader span:nth-child(4) {
    --i: 3;
    left: calc(100% - (50% / 4) * 2);
    top: calc(50% - (50% / 4));
  }
  .loader span:nth-child(5) {
    --i: 4;
    left: calc(100% - (50% / 4) * 2);
    top: calc(100% - (50% / 4) * 2);
  }
  .loader span:nth-child(6) {
    --i: 5;
    left: calc(50% - (50% / 4));
    top: calc(100% - (50% / 4) * 2);
  }
  .loader span:nth-child(7) {
    --i: 6;
    top: calc(100% - (50% / 4) * 2);
  }
  .loader span:nth-child(8) {
    --i: 7;
    top: calc(50% - (50% / 4));
  }

  .loader span {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc((50% / 4) * 2);
    height: calc((50% / 4) * 2);
    background: var(--indicator-color);
    box-shadow: 0 0 calc(var(--dot-width) / 2) var(--indicator-color);
    animation: animate calc(var(--speed)) linear infinite;
    animation-delay: calc(var(--speed) / 8 * var(--i));
  }

  @keyframes animate {
    0% {
      opacity: 1;
    }
    80%,
    100% {
      opacity: 0;
    }
  }
`;
