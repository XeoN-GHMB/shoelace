# Spinner-Circle

[component-header:sl-spinner-circle]

Spinners are used to show the progress of an indeterminate operation.

```html preview
<sl-spinner-circle></sl-spinner-circle>
```

```jsx react
import { SlSpinner } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinner />
);
```

## Examples

### Size

Spinners are sized based on the current font size. To change their size, set the `font-size` property on the spinner itself or on a parent element as shown below.

```html preview
<sl-spinner-circle></sl-spinner-circle>
<sl-spinner-circle style="font-size: 2rem;"></sl-spinner-circle>
<sl-spinner-circle style="font-size: 3rem;"></sl-spinner-circle>
```

```jsx react
import { SlSpinnerCircle } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <>
    <SlSpinnerCircle />
    <SlSpinnerCircle style={{ fontSize: '2rem' }} />
    <SlSpinnerCircle style={{ fontSize: '3rem' }} />
  </>
);
```

### Track Width

The width of the spinner's track can be changed by setting the `--track-width` custom property.

```html preview
<sl-spinner-circle style="font-size: 3rem; --track-width: 6px;"></sl-spinner-circle>
```

```jsx react
import { SlSpinnerCircle } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinnerCircle 
    style={{
      fontSize: '3rem',
      '--track-width': '6px'
    }} 
  />
);
```

### Color

The spinner's colors can be changed by setting the `--indicator-color` and `--track-color` custom properties.

```html preview
<sl-spinner-circle style="font-size: 3rem; --indicator-color: deeppink; --track-color: pink;"></sl-spinner-circle>
```

```jsx react
import { SlSpinnerCircle } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinnerCircle 
    style={{
      fontSize: '3rem',
      '--indicator-color': 'deeppink',
      '--track-color': 'pink'
    }} 
  />
);
```

[component-metadata:sl-spinner-circle]
