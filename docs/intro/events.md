# Events

[Events](/docs/api.md#events) are called to notify your application that something has happened. For example when your application has completely loaded, before a view is rendered, etc.

```
app({
  state: 2,
  view: state => <h1>{state}</h1>,
  actions: {
    next: state => state * state
  },
  events: {
    loaded: (state, actions) => setInterval(actions.next, 1000)
  }
})
```

You can register multiple event handlers too.

```
app({
  state: 0,
  view: state => <h1>{state}</h1>,
  actions: {
    addOne: state => state + 1
  },
  events: {
    loaded: [
      (state, actions) => actions.addOne(),
      (state, actions) => actions.addOne(),
      (state, actions) => actions.addOne()
    ]
  }
})
```

Events can be useful to hook into the update and render mechanism. For a practical example see the implementation of the [Router].

### Custom Events

To create custom events, use the [emit](/docs/api.md#emit) function which is passed as the last argument to actions and events.

```
app({
  view: (state, actions) =>
    <button onclick={actions.fail}>Fail</button>,
  actions: {
    fail: (state, actions, data, emit) =>
      emit("error", "Fail")
  },
  events: {
    error: (state, actions, error) => {
      throw error
    }
  }
})
```
