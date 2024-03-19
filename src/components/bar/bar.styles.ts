import { css } from 'lit';
import componentStyles from '../../styles/component.styles.js';

export default css`
  ${componentStyles}

  :host {
    align-items: stretch;
    display: flex;
    flex-wrap: wrap;
    min-height: 35px;
    position: relative;
    text-align: left;
    justify-content: space-between;
  }

  ::slotted(*) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width:100%;
  }

  .bar-group {
    display: flex;
  }

  .bar-group--left {
    justify-content: flex-start;
  }
  .bar-group--center {
    justify-content: center;
  }
  .bar-group--right {
    justify-content: flex-end;
  }

  @media (max-width: 39.95em) {
    :host {
      flex-direction: column;
    }
    .bar-group{
      flex-direction: column;
    }
    :host > * + * {
      margin-top: 10px;
    }
  }


`;
