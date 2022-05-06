import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}

  :host {
    display: block;
    --slider-dot-color: var(--sl-color-primary-600);
    --slider-arrow-color: var(--sl-color-primary-600);
    --slider-arrow-color-hover: var(--sl-color-primary-300);
  }

  .glider-contain {
    width: 100%;
    margin: 0 auto;
    position: relative;
  }
  .glider {
    margin: 0 auto;
    position: relative;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    transform: translateZ(0);
  }
  .glider-track {
    transform: translateZ(0);
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    z-index: 1;
  }
  .glider.draggable {
    user-select: none;
    cursor: -webkit-grab;
    cursor: grab;
  }
  .glider.draggable .glider-slide img {
    user-select: none;
    pointer-events: none;
  }
  .glider.drag {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }
  .glider-slide {
    user-select: none;
    justify-content: center;
    align-content: center;
    width: 100%;
  }
  .glider-slide img {
    max-width: 100%;
  }
  .glider::-webkit-scrollbar {
    opacity: 0;
    height: 0;
  }
  .glider-prev,
  .glider-next {
    user-select: none;
    position: absolute;
    outline: none;
    background: none;
    padding: 0;
    z-index: 2;
    font-size: 40px;
    text-decoration: none;
    left: 0;
    border: 0;
    top: calc(50% - 56px);
    cursor: pointer;

    opacity: 1;
    line-height: 1;
    transition: opacity 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67), color 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  }
  .glider-prev::part(base),
  .glider-next::part(base) {
    color: var(--slider-arrow-color);
  }

  .glider-prev::part(base):hover,
  .glider-next::part(base):hover {
    color: var(--slider-arrow-color-hover);
  }
  .glider-next {
    right: 0;
    left: auto;
  }
  .glider-next.disabled,
  .glider-prev.disabled {
    opacity: 0.25;
    color: #666;
    cursor: default;
  }
  .glider-slide {
    min-width: 150px;
  }
  .glider-hide {
    opacity: 0;
  }
  .glider-dots {
    user-select: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    padding: 0;
  }
  .glider-dot {
    border: 0;
    padding: 0;
    user-select: none;
    outline: none;
    display: block;
    cursor: pointer;
    color: var(--sl-color-neutral-300);
    border-radius: 999px;
    background: var(--sl-color-neutral-300);
    width: 12px;
    height: 12px;
    margin: 0 7px 0 7px;
  }
  .glider-dot:hover,
  .glider-dot.active {
    background: var(--slider-dot-color);
  }
  .thumbs{
    margin-top:7px;
    text-align: center;
  }
  .thumbs::slotted(.thumb){
    cursor: pointer;
    margin: 0 7px 0 7px;
  }

  @media (max-width: 36em) {
    .glider::-webkit-scrollbar {
      opacity: 1;
      -webkit-appearance: none;
      width: 7px;
      height: 3px;
    }
    .glider::-webkit-scrollbar-thumb {
      opacity: 1;
      border-radius: 99px;
      background-color: var(--sl-color-neutral-200);
      box-shadow: 0 0 1px var(--sl-color-neutral-200);
    }
  }
`;
