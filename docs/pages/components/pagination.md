---
meta:
  title: Pagination
  description: A Pagination component
layout: component
---

```html:preview
<sl-pagination id='page-btn-DIV' total='2120' page-size='20' value='1'></sl-pagination>
```

## Examples

### Simple Pagination

```html:preview
<sl-pagination id='page-btn-DIV2' total='2120' page-size='20' value='1'></sl-pagination>
<script > 
   let pageBtn=document.querySelector('#page-btn-DIV2');
   pageBtn.simple=true;
</script>
```

### Full Pagination

```html:preview
<sl-pagination id='page-btn-DIV3' total='2120' page-size='20' value='1'></sl-pagination>
<script > 
   let pageBtn=document.querySelector('#page-btn-DIV3');
     pageBtn.showFirst=true; //Show first page shortcut button
     pageBtn.showLast=true; //Show last page shortcut button
     pageBtn.showSizeChange=true; //Show resize paging select
     pageBtn.showPageChange=true; //Show direct jump to a page with an input
</script>
```


