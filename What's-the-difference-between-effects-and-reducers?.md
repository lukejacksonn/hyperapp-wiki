* Both reducers and effects are called actions.
* Reducers are pure functions that update the model, effects can cause side effects.
* Effects may trigger other actions, which enables you to update the model asynchronously. 

**Application**
```jsx
actions.action(data)
```
**HyperApp**
```jsx
if (action in reducers) { 
    const newModel = action(oldModel, data)
    render(view(newModel))

} else // action is an effect
    action(model, actions, data, error)
}
```