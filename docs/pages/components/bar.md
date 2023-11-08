---
meta:
  title: Bar
  description:
layout: component
---

```html:preview
<sl-bar>
  <div slot="left">
		<span>Just some Text</span>
	</div>
	<div slot="center">
		<sl-button size="small">A Button</sl-button>
		<a href="#">A Link</a>
		<span>Just some Text</span>
	</div>
	<div slot="right">
		<span>Just some Text</span>
		<a href="#">A Link</a>
		<a href="#">A Link</a>
 
	</div>

</sl-bar>
```

## Examples
```html:preview
<sl-bar>
	<sl-input slot="left" placeholder="Label" size="small" type="text"></sl-input>

	<div slot="right">
		<sl-button variant="danger" size="small">Zurücksetzen</sl-button>
		<sl-button variant="success" size="small">Absenden</sl-button>
	</div>
</sl-bar>
```

