## Mixins

Mixins allow you to reuse functionality between different applications. They can be useful to implement middlewares, plugins, etc.

```
const Logger = () => ({
  events: {
    action: (state, actions, data) => console.log(data),
  }
})

app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOne}>+1</button>
    </main>,
  actions: {
    addOne: state => state + 1
  },
  mixins: [Logger]
})
```
