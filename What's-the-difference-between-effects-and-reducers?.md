Reducers are regular functions, only special because they return a new copy of the state. A reducer **can't** do async operations.

Effects **can** be async, and they often are. Effects are used to cause side effects, like writing to a database or making requests to servers. Effects can dispatch other actions too, which is often the case, before or after an async task is done.

Reducers and effects make up all the actions you can dispatch in your application.

When you dispatch an action using `msg.action`, HyperApp will determine whether `action` is a reducer or an effect and 

For reducers, the reducer function will be applied to the model to obtain a new model. 

```js
const newModel = reducer(lastModel, data)
```

Next, HyperApp will re-render the current view using the new model.

For effects, the effect function will be called and the action will return immediately. 

```js
return effect(model, msg, data, error)
```

The signature of an effect is different to that of a reducer. Since effects can be async, they're not used to render the view. To cause the current view to be rendered again inside an effect, you can dispatch further actions to update the model using the `msg` object.

