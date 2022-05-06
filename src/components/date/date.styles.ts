import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host{
    display: inline-flex;
  }
  :host([block]){
      display: block;
  }

  :host([block])  sl-dropdown[part=base]{
      display: block;
  }

  :host([block]) sl-input{
      display: block;
  }

  sl-icon{
      cursor: pointer;
  }
  sl-input{
      display: inline-flex;
  }
`;
