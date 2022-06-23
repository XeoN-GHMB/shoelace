<!-- cspell:dictionaries lorem-ipsum -->

# Details

[component-header:sl-details]

Details show a brief summary and expand to show additional content.

```html preview
<sl-details prefix="minus" summary="Toggle Me">

  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</sl-details>
```

```jsx react
import { SlDetails } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlDetails summary="Toggle Me">
    {/*<SlIcon slot="prefix" name="plus"></SlIcon>*/}
    {/*<SlIcon slot="suffix" name="minus"></SlIcon>*/}
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </SlDetails>
);
```

## Examples

### Disabled

Use the `disable` attribute to prevent the details from expanding.

```html preview
<sl-details summary="Disabled" disabled>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</sl-details>
```

```jsx react
import { SlDetails } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlDetails summary="Disabled" disabled>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </SlDetails>
);
```
[component-metadata:sl-details]
