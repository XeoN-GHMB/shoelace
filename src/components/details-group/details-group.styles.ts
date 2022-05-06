import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}

  :host {
    display: block;
    --details-gap: var(--sl-spacing-2x-small);
  }

  ::slotted(sl-details:not(:last-of-type)) {
    margin-bottom: var(--details-gap);
  }
`;
