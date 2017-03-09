Lifecycle methods are custom event handlers invoked at various points in a [virtual node](hyperapp/hyperapp/wiki/api#h)'s life.

They are useful for starting animations and wrapping third party libraries that require a reference to the DOM element.

* <a name="oncreate"></a> [#](#oncreate) **onCreate**([element](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#) <td>Called when the element is appended to DOM.</td>

* <a name="onupdate"></a> [#](#onupdate) **onUpdate**([element](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#) <td>Called when the element is updated.</td>

* <a name="onremove"></a> [#](#onremove) **onRemove**([element](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#) <td>Called when the element is going to be removed.</td>

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
