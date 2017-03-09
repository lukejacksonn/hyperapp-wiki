Custom events that can be added to a [virtual node](hyperapp/hyperapp/wiki/api#h) to access its real DOM element before it is created, updated or removed.

```jsx
app({
  view: <div onCreate={elm => alert(elm)}></div>
})
```

The available methods are:

<a name="oncreate"></a>[#](#oncreate) **onCreate**([_element_](https://developer.mozilla.org/en-     US/docs/Web/API/Element)) [<>](#)

Called before the element is created.

<a name="onupdate"></a>[#](#onupdate) **onUpdate**([_element_](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#)

Called before the element is updated.

<a name="onremove"></a>[#](#onremove) **onRemove**([_element_](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#)

Called before the element is removed.

### Example

Integration with [CodeMirror](https://codemirror.net/).

```jsx
const node = document.createElement("div")
const editor = CodeMirror(node)

const Editor = options => {
    const setOptions = options =>
        Object.keys(options).forEach(key => editor.setOption(key, options[key]))

    const onCreate = e => {
        setOptions(options)
      
        e.appendChild(node)
      
        editor.focus()
        editor.refresh()
    }

    const onUpdate = _ => setOptions(options)

    return (
        <div
            onCreate={onCreate}
            onUpdate={onUpdate}
        >
        </div>
    )
}
```

[View Online](https://hyperapp-code-mirror.gomix.me)
