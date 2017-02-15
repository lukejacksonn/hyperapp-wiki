Reducers update the model, effects cause side effects. 

Effects may trigger other actions, which enables you to update the model asynchronously. 


Here is a simplified picture of what happens when your application sends an action

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

<div align=center>
<table>
  <tr>
    <th colspan="2">Actions</th>
  </tr>
  <tr>
    <th>Reducers</th>
    <th>Effects</th>
  </tr>
  <tr>
    <td>Update the model</td>
    <td>Cause side effects</td>
  </tr>
  <tr>
    <td>Return immmediately</td>
    <td>Can trigger other actions </td>
  </tr>
</table>
</div>