import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
  ${componentStyles}

  :host {
    display: block;
  }

  div {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    justify-content: center;
    background-color: #dddddd;
    gap: 2px;
    padding: 2px 3px;
  }

  sl-checkbox::part(base) {
    margin: 0;
    padding: 0;
    background-color: gray;
  }

  sl-checkbox::part(label) {
    margin: 0;
    padding: 0;
  }

  sl-icon {
    cursor: pointer;
    color: gray;
    font-size: 12px;
    font-weight: 900;
  }
`;
