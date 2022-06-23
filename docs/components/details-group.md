# Details Group

[component-header:sl-details-group]

A wrapper around the details component to simulate a group or "accordion" where only one is shown at a time

```html preview
<sl-details-group>
  <sl-details summary="First" open>
    <sl-icon slot="prefix" name="plus"></sl-icon>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    <sl-icon slot="suffix" name="minus"></sl-icon>
    <sl-icon slot="summary-icon" name="megaphone"></sl-icon>
  </sl-details>

  <sl-details summary="Second">
    <sl-icon slot="prefix" name="envelope"></sl-icon>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    <sl-badge slot="suffix" variant="primary" pill>12</sl-badge>
    <sl-icon slot="summary-icon" name="photo"></sl-icon>
  </sl-details>

  <sl-details summary="Third">
    <sl-icon slot="prefix" name="puzzle"></sl-icon>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    <sl-icon slot="suffix" name="minus"></sl-icon>
    <sl-icon slot="summary-icon" name="sun"></sl-icon>    
  </sl-details>
</sl-details-group>
```

[component-metadata:sl-details-group]
