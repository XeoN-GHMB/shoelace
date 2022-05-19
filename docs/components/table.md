# Table

[component-header:sl-table]

Create an interactive Table widget, from an existing table or use the properties skellist and structure.

```html preview
<sl-table id="exampletable" moveablecolumns moveablerows rowselect>
  <table>
    <thead>
        <tr>
            <th width="150">First Column</th>
            <th>Second Column</th>
            <th tabulator-formatter="html">Thrid Column</th>
        </tr>
    </thead>
  
    <tbody>
        <tr>
          <td>Hello 200</td>
          <td>Alpha</td>
          <td>3</td>
        </tr>
        <tr>
          <td>Hello 20</td>
          <td>Gamma</td>
          <td>40</td>
        </tr>
        <tr>
          <td>Hello 1</td>
          <td>Delta</td>
          <td>15</td>
        </tr>
        <tr>
          <td>Hello</td>
          <td>Zeta</td>
          <td><span style="font-weight:bold">4</span></td>
        </tr>
    </tbody>
  </table>
</sl-table>
<span id="selectionspan">Rows selected: 0</span>
<script>
let table1 = document.querySelector("#exampletable")
table1.addEventListener("sl-selectionChanged",(event)=>{
  console.log(event)
  let span = document.querySelector("#selectionspan")
  span.innerHTML = "Rows selected: "+event.detail.data.length

})


</script>

```

## Examples

The Property skellist ist reactive and can be modified on runtime.
```html preview
<sl-button id="addentry">add Entry</sl-button>
<sl-button id="cleartable">clear Table</sl-button>
<sl-button id="loadtable">load default</sl-button>
<sl-table id="exampletable2">
</sl-table>
<script>
let defaultData = [{"key":1233423,"name":"Test1"},{"key":2222,"name":"Test2"},{"key":4564564,"name":"Test3"}]

let table = document.querySelector("#exampletable2")
table.structure={"key":{"descr":"Key"}, "name":{"descr":"Name"}}

table.skellist=defaultData

document.querySelector("#addentry").addEventListener("click",(event)=>{
  if (table.skellist.length===0){
  table.skellist = [{"key":1231113423,"name":"ADD1"}]
  }else{
    table.skellist.push({"key":1231113423,"name":"ADD1"})
  }

})

document.querySelector("#cleartable").addEventListener("click",(event)=>{
  table.skellist = []
})

document.querySelector("#loadtable").addEventListener("click",(event)=>{
  table.skellist = defaultData
})
</script>
```


### First Example
By setting the table height the table will use a virutal dom to support large datasets.
```html preview
<sl-input id="search" placeholder="search"></sl-input>

<sl-table id="exampletable3" height="500px" sort="name">
</sl-table>
<script>
let defaultData = [{"key":1233423,"name":"Test1"},{"key":2222,"name":"Test2"},{"key":4564564,"name":"Test3"}]

let table = document.querySelector("#exampletable3")
table.structure={"key":{"descr":"Key"}, "name":{"descr":"Name"}}

let largeData = []
 for(let i=0,j=20000-largeData.length;i<j;i++){
    largeData.push( { key: i, name: 'Test add'+i, role: 'Test1', sex: Math.random()>0.5?'Man':'Women', age: 28, address: 'Javascript'+i });
}

table.skellist=largeData

document.querySelector("#search").addEventListener("input",(event)=>{
table.search = event.target.value;
})



</script>
```
[component-metadata:sl-table]
