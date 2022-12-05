# Bone

[component-header:sl-bone]

Bone Elements

```html preview

```

## Raw Bone

```html preview
<sl-bone id="raw"></sl-bone>
<sl-bone id="raw_multiple"></sl-bone>
<sl-bone id="raw_language"></sl-bone>
<sl-bone id="raw_multiple_language"></sl-bone>

<sl-details summary="Filled">
    <sl-bone id="raw_filled"></sl-bone>
    <sl-bone id="raw_multiple_filled"></sl-bone>
    <sl-bone id="raw_language_filled"></sl-bone>
    <sl-bone id="raw_multiple_language_filled"></sl-bone>
</sl-details>

<sl-details summary="Readonly">
<sl-bone id="raw_readonly"></sl-bone>
<sl-bone id="raw_multiple_readonly"></sl-bone>
<sl-bone id="raw_language_readonly"></sl-bone>
<sl-bone id="raw_multiple_language_readonly"></sl-bone>
</sl-details>

<sl-details summary="Readonly Filled">
    <sl-bone id="raw_readonly_filled"></sl-bone>
    <sl-bone id="raw_multiple_readonly_filled"></sl-bone>
    <sl-bone id="raw_language_readonly_filled"></sl-bone>
    <sl-bone id="raw_multiple_language_readonly_filled"></sl-bone>
</sl-details>
<style>
sl-details{
    margin-bottom:20px;
}
</style>

<script>

for(let i of ["raw",
              "raw_multiple",
              "raw_language",
              "raw_multiple_language",
              "raw_readonly",
              "raw_filled",
              "raw_multiple_filled",
              "raw_language_filled",
              "raw_multiple_language_filled",
              "raw_readonly",
              "raw_multiple_readonly",
              "raw_language_readonly",
              "raw_multiple_language_readonly",
              "raw_readonly_filled",
              "raw_multiple_readonly_filled",
              "raw_language_readonly_filled",
              "raw_multiple_language_readonly_filled",
  ]){
    let bone = document.querySelector("#"+i)
    bone.renderType = "edit"
    bone.renderLabel = true
    bone.boneName = "bone_"+i

    
    let type = i
    let mult = false
    let readonly = false
    let language = null
    if (i.includes("_multiple")){
        mult = true
    }
    
    if (i.includes("_readonly")){
        readonly = true
    }
    
    if (i.includes("_language")){
        language = ["de","en"]
    }
    bonevalue = null
    if (i.includes("_filled")){
        if (i.includes("_language")){
            if (i.includes("_multiple")){
                bonevalue = {
                    "de":["testvalue_de_1","testvalue_de_2"],
                    "en":["testvalue_en_1","testvalue_en_2"]
                }
            }else{
                bonevalue = {"de":"testvalue_de","en":"testvalue_en"}
            } 
        }else{
            if (i.includes("_multiple")){
                bonevalue = ["testvalue_1","testvalue_2"]
            }else{
                bonevalue = "testvalue"
            }
        }
    }
    
    
    bone.boneStructure={
    "visible":true, 
    "type":type,
    "multiple":mult, 
    "readonly":readonly,
    "descr":i+"-bone", 
    "languages":language,
    "emptyValue":null
    
    }
    bone.boneValue = bonevalue
    
}
</script>
```


### First Example

```html preview

```
[component-metadata:sl-bone]
