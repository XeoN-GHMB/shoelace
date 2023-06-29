---
meta:
  title: Back To Top
  description: A description of the component goes here.
layout: component
---

A description of the component goes here.

```html preview
<div id="scroller" style="overflow-y:scroll;height:200px">
  <div style="height:1000px"> scroll down...</div>
  <sl-back-to-top target="#scroller"></sl-back-to-top>
</div>
```

## Examples

### Custom Button
```html preview
<div id="scroller2" style="overflow-y:scroll;height:200px">
  <div style="height:1000px"> scroll down...</div>
  <sl-back-to-top target="#scroller2">
  <sl-button>top</sl-button>
  </sl-back-to-top>
</div>
```

### Static Position
```html preview
<div id="scroller3" style="overflow-y:scroll;height:200px">
  <div style="height:1000px"> scroll down...</div>
  <sl-back-to-top target="#scroller3" style="position:absolute;bottom:35px;right:85px"></sl-back-to-top>
</div>
```

### Static Positon and hide on Top
```html preview
<style>
  .toTopButton{
    position:absolute;
    bottom:35px;
    right:-10px;
    opacity:0;
  }
  .containerWrapper{
    overflow:hidden;
    overflow-y:scroll;
    height:200px
  }
  .toTopButton.scrolled{
    right:85px;
     opacity:1;
  }
  
</style>
<div id="scroller4" class="containerWrapper">
  <div style="height:1000px"> scroll down...</div>
  <sl-back-to-top target="#scroller4" class="toTopButton"></sl-back-to-top>
</div>
```
