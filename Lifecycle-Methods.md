Lifecycle methods are functions that can be attached to [virtual nodes](hyperapp/hyperapp/wiki/api#h) in order to access a real DOM element before it is created, updated or removed.

```jsx
app({
  view: <div onCreate={element => console.log(element)}></div>
})
```
The available methods are:

* onCreate([Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)):  Called before an element is created.

* onUpdate([Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)): Called before an element is updated.

* onRemove([Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)): Called before an element is removed.

### Examples
Using the [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) element.

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
    (_, actions) => setInterval(_ => actions.move(), 60)
  ],
  view: model =>
    <canvas
      width="600"
      height="300"
      onUpdate={e => repaint(e, model)}
    />
})
```

[View online](http://codepen.io/jbucaran/pen/MJXMQZ/).