# Actions

As mentioned in [view and state], the only way to modify the applications state and is through [actions](/docs/api.md#actions). Actions are pure functions that take the current state and transform it into a new one (which causes the view to be re-rendered). Actions can be triggered by DOM Events such as `onclick`.

```
app({
  state: "Hi.",
  view: (state, actions) =>
    <h1 onclick={actions.upcase}>{state}</h1>,
  actions: {
    upcase: state => state.toUpperCase()
  }
})
```

To modify the state, an action must return a new state (or fragment thereof). In the [counter demo](), the `addOne` action takes the current `state` and returns the new state which is `state + 1`.

```
app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOne}>+1</button>
    </main>,
  actions: {
    addOne: state => state + 1
  }
})
```

It is also possible to pass data to actions as well.

```
app({
  state: 0,
  view: (state, actions) => (
    <main>
      <h1>{state}</h1>
      <button
        onclick={() => actions.addSome(1))}>More
      </button>
    </main>
  ),
  actions: {
    addSome: (state, actions, data = 0) => state + data
  }
})
```

Actions are not required to have a return value. You can use them to call other actions, for example after an asynchronous operation has completed.

```
app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}></button>
    </main>,
  actions: {
    addOne: state => state + 1,
    addOneDelayed: (state, actions) =>
      setTimeout(actions.addOne, 1000)
  }
})
```

An action can return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This enables you to use [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

```
const delay = seconds =>
  new Promise(done => setTimeout(done, seconds * 1000))

app({
  state: 0,
  view: (state, actions) =>
    <main>
      <h1>{state}</h1>
      <button onclick={actions.addOneDelayed}>+1</button>
    </main>,
  actions: {
    addOne: state => state + 1,
    addOneDelayed: async (state, actions) => {
      await delay(1)
      actions.addOne()
    }
  }
})
```
