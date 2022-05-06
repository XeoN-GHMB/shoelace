import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host {
      display:flex !important;
      flex-direction:row;
  }
  :host([row]){
      flex-direction:row;
  }
  :host([column]){
      flex-direction:column;
  }
  :host([expand]) {
      flex:1;
  }
  :host([center]) {
     justify-content: center;
     align-items: center;
  }

`;
