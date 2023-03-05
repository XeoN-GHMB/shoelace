# Python

[component-header:sl-python]

A description of the component goes here.

```html preview
<sl-python id="helloworld"></sl-python>
<script>
    const py = document.querySelector("#helloworld");
    py.code=`print("Hello World")`
    py.name=`1`
    py.run();
</script>
```

(Dialogs (confirm))
```html preview
<sl-python id="dialog-confirm"></sl-python>
<sl-button id="dialog-confirm-run">Run</sl-button>
<script>
    const py = document.querySelector("#dialog-confirm");
    const start = document.querySelector("#dialog-confirm-run");
    py.code=`import scriptor\nawait scriptor.dialog.confirm(title="Hello World",text="Agree?")\nprint("Next instruction")`
    py.run();
    //start.addEventListener("click",()=>{py.run()});
</script>
```
## Examples

### First Example

TODO

### Second Example

TODO

[component-metadata:sl-python]
