import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}

:host{
    display:grid;
    grid-template-columns:repeat(var(--sl-row-columns),1fr);
    grid-gap:var(--sl-row-grap,0);
}


`;
