import { css } from 'lit';

export default css`
  :host {
    --font-weight: var(--sl-font-weight-semibold);
    --letter-spacing: var(--sl-letter-spacing-normal);
    --border-radius: var(--sl-border-radius-small);
    --border-width: 1px;
    --border-style: solid;
    --border-color: var(--sl-color-neutral-0);
    --color: var(--sl-color-neutral-0);
    --background: var(--sl-color-neutral-600);
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--font-weight);
    letter-spacing: var(--letter-spacing);
    line-height: 1;
    border-radius: var(--border-radius);
    border-width: var(--border-width);
    border-style: var(--border-style);
    border-color: var(--border-color);
    white-space: nowrap;
    padding: 0.35em 0.6em;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
    color: var(--color);
    background: var(--background);
  }

  /* Variant modifiers */
  .badge--primary {
    --background: var(--sl-color-primary-600);
    --color: var(--sl-color-neutral-0);
  }

  .badge--success {
    --background: var(--sl-color-success-600);
    --color: var(--sl-color-neutral-0);
  }

  .badge--neutral {
    --background: var(--sl-color-neutral-600);
    --color: var(--sl-color-neutral-0);
  }

  .badge--warning {
    --background: var(--sl-color-warning-600);
    --color: var(--sl-color-neutral-0);
  }

  .badge--danger {
    --background: var(--sl-color-danger-600);
    --color: var(--sl-color-neutral-0);
  }

  .badge--info {
    --background: var(--sl-color-info-600);
    --color: var(--sl-color-neutral-0);
  }

  .badge--secondary {
    --background: var(--sl-color-secondary-600);
    --color: var(--sl-color-neutral-0);
  }

  /* Pill modifier */
  .badge--pill {
    --border-radius: var(--sl-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--sl-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--sl-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--sl-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--sl-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--sl-color-danger-600);
  }

  .badge--pulse.badge--info {
    --pulse-color: var(--sl-color-info-600);
  }

  .badge--pulse.badge--secondary {
    --pulse-color: var(--sl-color-secondary-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;
