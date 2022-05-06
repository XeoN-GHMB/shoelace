import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host{
    display:block ;
  }
  div[part='container']{
    display:flex;
  }

  :host([vertical]) div[part='container']{
     flex-direction:column;
     display:block;
   }
`;
