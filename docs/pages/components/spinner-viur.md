---
meta:
  title: Spinner ViUR
  description: Spinners are used to show the progress of an indeterminate operation.
layout: component
---

```html:preview
<sl-spinner-viur></sl-spinner-viur>
```
{% raw %}
```jsx:react
import { SlSpinnerViur } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinnerViur />
);
```
{% endraw %}
## Examples

### Size

Spinners are sized based on the current font size. To change their size, set the `font-size` property on the spinner itself or on a parent element as shown below.

```html:preview
<sl-spinner-viur></sl-spinner-viur>
<sl-spinner-viur style="font-size: 2rem;"></sl-spinner-viur>
<sl-spinner-viur style="font-size: 3rem;"></sl-spinner-viur>
```
{% raw %}
```jsx:react
import { SlSpinnerViur } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <>
    <SlSpinnerViur />
    <SlSpinnerViur style={{ fontSize: '2rem' }} />
    <SlSpinnerViur style={{ fontSize: '3rem' }} />
  </>
);
```
{% endraw %}
### Color

The spinner's colors can be changed by setting the `--indicator-color`

```html:preview
<sl-spinner-viur style="font-size: 3rem; --indicator-color: deeppink"></sl-spinner>
```
{% raw %}
```jsx:react
import { SlSpinnerViur } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinnerViur 
    style={{
      fontSize: '3rem',
      '--indicator-color': 'deeppink'
    }} 
  />
);
```
{% endraw %}
### Speed

The spinner's speed can be changed by setting the `--speed`

```html:preview
<sl-spinner-viur style="font-size: 2rem; --speed: .5s"></sl-spinner>
```
{% raw %}
```jsx:react
import { SlSpinnerViur } from '@shoelace-style/shoelace/dist/react';

const App = () => (
  <SlSpinnerViur
    style={{
      fontSize: '2rem',
      '--speed': '.5s'
    }} 
  />
);
```
{% endraw %}
