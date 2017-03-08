Lifecycle are custom events that can be attached to a [virtual nodes](hyperapp/hyperapp/wiki/api#h) in order to access the real DOM element before it is created, updated or removed.

```jsx
app({
  view: <div onCreate={elm => alert(elm)}></div>
})
```

The available methods are:

<a name="oncreate"></a>[#](#oncreate) **onCreate**([_Element_](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#)

Called before the element is created.

<a name="onupdate"></a>[#](#onupdate) **onUpdate**([_Element_](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#)

Called before the element is updated.

<a name="onremove"></a>[#](#onremove) **onRemove**([_Element_](https://developer.mozilla.org/en-US/docs/Web/API/Element)) [<>](#)

Called before the element is removed.

### Examples
Using a [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) element.

```jsx
const repaint = (canvas, model) => {
  const context = canvas.getContext("2d")
  context.fillStyle = "white"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.beginPath()
  context.arc(model.x, model.y, 50, 0, 2 * Math.PI)
  context.stroke()
}

app({
  model: { x: 0, y: 0 },
  actions: {
    move: model => ({
      x: model.x + 1,
      y: model.y + 1,
    })
  },
  subscriptions: [
    (_, actions) => setInterval(actions.move, 60)
  ],
  view: model =>
    <canvas
      width="600"
      height="300"
      onUpdate={e => repaint(e, model)}
    />
})
```

[View Online](http://codepen.io/jbucaran/pen/MJXMQZ)