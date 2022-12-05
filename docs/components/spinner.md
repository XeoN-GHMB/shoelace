# Spinner

[component-header:sl-spinner]

```html preview
<sl-spinner></sl-spinner>
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
<sl-spinner></sl-spinner>
<sl-spinner style="font-size: 2rem;"></sl-spinner>
<sl-spinner style="font-size: 3rem;"></sl-spinner>
```

```jsx react
import { SlSpinner } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <>
    <SlSpinner />
    <SlSpinner style={{ fontSize: '2rem' }} />
    <SlSpinner style={{ fontSize: '3rem' }} />
  </>
);
```

### Color

The spinner's colors can be changed by setting the `--indicator-color`

```html preview
<sl-spinner style="font-size: 3rem; --indicator-color: deeppink"></sl-spinner>
```

```jsx react
import { SlSpinner } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinner 
    style={{
      fontSize: '3rem',
      '--indicator-color': 'deeppink'
    }} 
  />
);
```

### Speed

The spinner's speed can be changed by setting the `--speed`

```html preview
<sl-spinner style="font-size: 2rem; --speed: .5s"></sl-spinner>
```

```jsx react
import { SlSpinner } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinner 
    style={{
      fontSize: '2rem',
      '--speed': '.5s'
    }} 
  />
);
```


[component-metadata:sl-spinner]
