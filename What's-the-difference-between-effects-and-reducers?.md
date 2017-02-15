Reducers update the model, effects cause side effects. 

Effects may trigger other actions, which enables you to update the model asynchronously. 

Both reducers and effects are called actions.

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