# Bone

[component-header:sl-bone]

Bone Elements


## Bone

```html preview
<sl-bone fromjson="true" bonename="name" bonestructure='{"descr": "E-Mail", "type": "str.email", "required": true, "params": {}, "visible": true, "readonly": false, "unique": 1, "languages": null, "emptyvalue": "", "indexed": true, "multiple": false, "maxlength": 254, "sortindex": 4}' bonevalue='{"value": "foo@bar.com"}'></sl-bone>
<br>
Edit:
<sl-bone rendertype="edit" fromjson="true" bonename="name" bonestructure='{"descr": "E-Mail", "type": "str.email", "required": true, "params": {}, "visible": true, "readonly": false, "unique": 1, "languages": null, "emptyvalue": "", "indexed": true, "multiple": false, "maxlength": 254, "sortindex": 4}' bonevalue='{"value": "foo@bar.com"}'></sl-bone>
```

(with boneStructure / renderType='view')
```html preview
<sl-bone id="testbone"></sl-bone>
<script>
    const bone = document.querySelector("#testbone") 
    bone.boneStructure={
    "visible":true, 
    "type":"raw",
    "multiple":true, 
    "readonly":false,
    "descr":"TestBonename", 
    "languages":["de","en"],
    "emptyValue":null
    }
    bone.boneValue={"de":["123","123"],"en":["123saden"]}
</script>
```


(with boneStructure / renderType='edit')
```html preview
<sl-bone id="testbone-edit" renderType='edit' ></sl-bone>

<sl-bone id="testbone-edit-label" renderType='edit' renderLabel></sl-bone>
<sl-bone id="testbone-edit-label-multi" renderType='edit' renderLabel></sl-bone>

<sl-bone id="testbone-edit-save" renderType='edit' rendersaveButton></sl-bone>


<script>
    const bone = document.querySelector("#testbone-edit");
    const bone_label = document.querySelector("#testbone-edit-label");
    const bone_save = document.querySelector("#testbone-edit-save");
    
    const structure = {
    "visible":true, 
    "type":"raw",
    "multiple":false, 
    "readonly":false,
    "descr":"TestBonename", 
    "languages":null,
    "emptyvalue":""}
    
    bone.boneStructure=structure
    bone_label.boneStructure=structure
    bone_save.boneStructure=structure
    
    //bone.boneValue="Test"
    //bone_label.boneValue="Test"
    bone_save.boneValue="Test"
</script>
```
(without boneStructure / renderType='view')
```html preview

 <sl-bone renderType="view" type="raw" name="testme" renderLabel boneValue="TestValue"></sl-bone>

```
[component-metadata:sl-bone]
