Lifecycle are custom events that can be used in a [virtual node](hyperapp/hyperapp/wiki/api#h) to access its real DOM element before it is created, updated or removed.

```jsx
app({
  view: <div onCreate={elm => alert(elm)}></div>
})
```

The available methods are:

### <a name="oncreate"></a>[#](#oncreate) **onCreate**([_element_](https://developer.mozilla.org/en-     US/docs/Web/API/Element)) [<>](#)

Called before the element is created.

### <a name="onupdate"></a>[#](#onupdate) **onUpdate**([_element_](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#)

Called before the element is updated.

### <a name="onremove"></a>[#](#onremove) **onRemove**([_element_](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#)

Called before the element is removed.

## Examples

<a name="lifecycle_methods_canvas"></a>[#](#lifecycle_methods_canvas) Using a [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) element.

```jsx
app({
  model: { x: 0, y: 0 },
  actions: {
    move: model => ({
      x: model.x + 1,
      y: model.y + 1,
    }),
    repaint: (model, canvas) => {
      const context = canvas.getContext("2d")
      context.fillStyle = "white"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.beginPath()
      context.arc(model.x, model.y, 50, 0, 2 * Math.PI)
      context.stroke()
    }
  },
  subscriptions: [
    (_, actions) => setInterval(actions.move, 60)
  ],
  view: (model, actions) =>
    <canvas
      width="600"
      height="300"
      onUpdate={actions.repaint}
    />
})
```

[View Online](https://codepen.io/jbucaran/pen/MJXMQZ)

<a name="lifecycle_methods_codemirror"></a>[#](#lifecycle_methods_codemirror) Integration with [CodeMirror](https://codemirror.net/).

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

[View Online](https://hyperapp-code-mirror.gomix.me/)

<a name="lifecycle_methods_quilljs"></a>[#](#lifecycle_methods_quilljs) Integration with [Quill.js](https://quilljs.com/).

```jsx
const Editor = ({ setText }) =>
  <div
    onCreate={elm => {
      const editor = new Quill(elm)
      editor.on("text-change", _ => setText(editor.getText()))
    }}
  ></div>

app({
  model: "",
  actions: {
    setText: (_, text) => text.trim()
  },
  view: (model, actions) =>
    <div>
      <Editor setText={actions.setText} />
      <span>Words: {model.split(/\S+/).length - 1}</span>
    </div>
})
```

[View Online](https://codepen.io/jbucaran/pen/MJMqJN?editors=0010)

