import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host{
      display:block ;
      border: 1px solid var(--sl-collapse-border-color,#c8c8c8);
      border-top:none;
  }
`;
