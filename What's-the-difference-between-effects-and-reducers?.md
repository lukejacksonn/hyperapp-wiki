Reducers return the next model, therefore they can't do async operations.

Effects can be async, and they often are. Effects can dispatch other actions too, enabling you to update the model.

When you dispatch an action using `actions.action`, HyperApp will determine whether `action` is a reducer or an effect.

**Reducers**
```js
const newModel = reducer(lastModel, data)
render(view(model))
```

**Effects**
```js
return effect(model, actions, data, error)
```

