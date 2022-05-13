# Table

[component-header:sl-table]

A description of the component goes here.

```html preview
<sl-table id="exampletable" moveablecolumns moveablerows rowselect>
  <table>
    <thead>
        <tr>
            <th width="150">First Column</th>
            <th>Second Column</th>
            <th>Thrid Column</th>
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
          <td>4</td>
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

### Second Example
```html preview
<sl-table id="exampletable4" minheight="400px">
</sl-table>
<script>

let table = document.querySelector("#exampletable4")
table.structure={
    "key": {
        "descr": "key",
        "type": "key",
        "required": false,
        "params": {},
        "visible": false,
        "readonly": true,
        "unique": false,
        "languages": null,
        "emptyValue": null,
        "multiple": false
    },
    "creationdate": {
        "descr": "created at",
        "type": "date",
        "required": false,
        "params": {},
        "visible": true,
        "readonly": true,
        "unique": false,
        "languages": null,
        "emptyValue": null,
        "multiple": false,
        "date": true,
        "time": true
    },
    "changedate": {
        "descr": "updated at",
        "type": "date",
        "required": false,
        "params": {},
        "visible": false,
        "readonly": true,
        "unique": false,
        "languages": null,
        "emptyValue": null,
        "multiple": false,
        "date": true,
        "time": true
    },
    "viurCurrentSeoKeys": {
        "descr": "Seo-Keys",
        "type": "str",
        "required": false,
        "params": {},
        "visible": false,
        "readonly": true,
        "unique": false,
        "languages": [
            "en"
        ],
        "emptyValue": "",
        "multiple": false
    },
    "listgroups": {
        "descr": "groups",
        "type": "str",
        "required": false,
        "params": {},
        "visible": false,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": "",
        "multiple": true
    },
    "listgroup": {
        "descr": "group",
        "type": "str",
        "required": false,
        "params": {},
        "visible": false,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": "",
        "multiple": false
    },
    "name": {
        "descr": "Name",
        "type": "str",
        "required": true,
        "params": {},
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": "",
        "multiple": false
    },
    "sortindex": {
        "descr": "Sort index",
        "type": "numeric",
        "required": true,
        "params": {},
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": 0,
        "multiple": false,
        "precision": 0,
        "min": -1073741824,
        "max": 1073741824
    },
    "image": {
        "descr": "Image",
        "type": "relational.tree.leaf.file.file",
        "required": false,
        "params": {},
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": null,
        "multiple": false,
        "module": "file",
        "format": "value['dest']['name']",
        "using": null,
        "relskel": [
            [
                "key",
                {
                    "descr": "key",
                    "type": "key",
                    "required": false,
                    "params": {},
                    "visible": false,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": null,
                    "multiple": false
                }
            ],
            [
                "size",
                {
                    "descr": "Size",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "dlkey",
                {
                    "descr": "Download-Key",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "name",
                {
                    "descr": "Filename",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": false,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "mimetype",
                {
                    "descr": "Mime-Info",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "width",
                {
                    "descr": "Width",
                    "type": "numeric",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": 0,
                    "multiple": false,
                    "precision": 0,
                    "min": -1073741824,
                    "max": 1073741824
                }
            ],
            [
                "height",
                {
                    "descr": "Height",
                    "type": "numeric",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": 0,
                    "multiple": false,
                    "precision": 0,
                    "min": -1073741824,
                    "max": 1073741824
                }
            ],
            [
                "derived",
                {
                    "descr": "Derived Files",
                    "type": "hidden",
                    "required": false,
                    "params": {},
                    "visible": false,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": null,
                    "multiple": false
                }
            ]
        ]
    },
    "translations": {
        "descr": "Langs",
        "type": "str",
        "required": true,
        "params": {},
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": [
            "de",
            "en"
        ],
        "emptyValue": "",
        "multiple": true
    },
    "users": {
        "descr": "Users",
        "type": "relational.user",
        "required": false,
        "params": {},
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": null,
        "multiple": true,
        "module": "user",
        "format": "value['dest']['name']",
        "using": null,
        "relskel": [
            [
                "key",
                {
                    "descr": "key",
                    "type": "key",
                    "required": false,
                    "params": {
                        "category": "System"
                    },
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": null,
                    "multiple": false
                }
            ],
            [
                "name",
                {
                    "descr": "E-Mail",
                    "type": "str.email",
                    "required": true,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": 1,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ]
        ]
    },
    "test": {
        "descr": "FFF",
        "type": "text",
        "required": false,
        "params": {},
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": "",
        "multiple": false,
        "validHtml": {
            "validTags": [
                "b",
                "a",
                "i",
                "u",
                "span",
                "div",
                "p",
                "img",
                "ol",
                "ul",
                "li",
                "abbr",
                "sub",
                "sup",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "table",
                "thead",
                "tbody",
                "tfoot",
                "tr",
                "td",
                "th",
                "br",
                "hr",
                "strong",
                "blockquote",
                "em"
            ],
            "validAttrs": {
                "a": [
                    "href",
                    "target",
                    "title"
                ],
                "abbr": [
                    "title"
                ],
                "span": [
                    "title"
                ],
                "img": [
                    "src",
                    "alt",
                    "title"
                ],
                "td": [
                    "colspan",
                    "rowspan"
                ],
                "p": [
                    "data-indent"
                ],
                "blockquote": [
                    "cite"
                ]
            },
            "validStyles": [
                "color"
            ],
            "validClasses": [
                "vitxt-*",
                "viur-txt-*"
            ],
            "singleTags": [
                "br",
                "img",
                "hr"
            ]
        }
    },
    "seo_title": {
        "descr": "SEO Title",
        "type": "str",
        "required": false,
        "params": {
            "category": "SEO"
        },
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": "",
        "multiple": true
    },
    "seo_description": {
        "descr": "SEO Description",
        "type": "str",
        "required": false,
        "params": {
            "category": "SEO"
        },
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": "",
        "multiple": false
    },
    "seo_keywords": {
        "descr": "SEO Keywords",
        "type": "str",
        "required": false,
        "params": {
            "category": "SEO"
        },
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": "",
        "multiple": false
    },
    "seo_image": {
        "descr": "SEO Preview Image",
        "type": "relational.tree.leaf.file.file",
        "required": false,
        "params": {
            "category": "SEO"
        },
        "visible": true,
        "readonly": false,
        "unique": false,
        "languages": null,
        "emptyValue": null,
        "multiple": false,
        "module": "file",
        "format": "value['dest']['name']",
        "using": null,
        "relskel": [
            [
                "key",
                {
                    "descr": "key",
                    "type": "key",
                    "required": false,
                    "params": {},
                    "visible": false,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": null,
                    "multiple": false
                }
            ],
            [
                "size",
                {
                    "descr": "Size",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "dlkey",
                {
                    "descr": "Download-Key",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "name",
                {
                    "descr": "Filename",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": false,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "mimetype",
                {
                    "descr": "Mime-Info",
                    "type": "str",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": "",
                    "multiple": false
                }
            ],
            [
                "width",
                {
                    "descr": "Width",
                    "type": "numeric",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": 0,
                    "multiple": false,
                    "precision": 0,
                    "min": -1073741824,
                    "max": 1073741824
                }
            ],
            [
                "height",
                {
                    "descr": "Height",
                    "type": "numeric",
                    "required": false,
                    "params": {},
                    "visible": true,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": 0,
                    "multiple": false,
                    "precision": 0,
                    "min": -1073741824,
                    "max": 1073741824
                }
            ],
            [
                "derived",
                {
                    "descr": "Derived Files",
                    "type": "hidden",
                    "required": false,
                    "params": {},
                    "visible": false,
                    "readonly": true,
                    "unique": false,
                    "languages": null,
                    "emptyValue": null,
                    "multiple": false
                }
            ]
        ]
    }
}
table.skellist= [
        {
            "key": "dfgdfgdfgdfgdfgdfgdfg",
            "creationdate": "2022-03-14T15:18:58+01:00",
            "changedate": "2022-03-14T15:18:58+01:00",
            "viurCurrentSeoKeys": {
                "en": dfgdfgdfgdfg
            },
            "listgroups": [
                "all"
            ],
            "listgroup": "all",
            "name": "Test1",
            "sortindex": 1,
            "image": null,
            "translations": {
                "de": [],
                "en": []
            },
            "users": null,
            "test": "",
            "seo_title": "",
            "seo_description": "",
            "seo_keywords": "",
            "seo_image": null
        },
        {
            "key": "gdfgfhgfhgfhgfh",
            "creationdate": "2022-05-12T06:02:05+02:00",
            "changedate": "2022-05-12T06:02:05+02:00",
            "viurCurrentSeoKeys": {
                "en": dfgdfgdfgdfg
            },
            "listgroups": [
                "all"
            ],
            "listgroup": "all",
            "name": "Test1",
            "sortindex": 222,
            "image": {
                "dest": {
                    "key": "dgdgdfg",
                    "size": "5122",
                    "dlkey": "dfgdfgdfgd",
                    "name": "5dfgdfgdfg.png",
                    "mimetype": "image/png",
                    "width": 0,
                    "height": 0,
                    "derived": null,
                    "downloadUrl": "/img/img.png"
                },
                "rel": null
            },
            "translations": {
                "de": [
                    "Test222",
                    "Test44"
                ],
                "en": [
                    "Test55",
                    "Test677",
                    "Tert666"
                ]
            },
            "users": [
                {
                    "dest": {
                        "key": "hfghfhfhgfhfghfghf65u56uzhzfj",
                        "name": "me@example.com"
                    },
                    "rel": null
                }
            ],
            "test": "AAAAAAA",
            "seo_title": ["dsfg", "fdgdfg"],
            "seo_description": "gfhgf",
            "seo_keywords": "hfghfg",
            "seo_image": null
        }
    ]
</script>
```

[component-metadata:sl-table]
