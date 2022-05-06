import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
const result = css`
  ${componentStyles}
  #base{
      position: relative;
      height: 100%;
      overflow: auto;
  }
`;
export default result;
