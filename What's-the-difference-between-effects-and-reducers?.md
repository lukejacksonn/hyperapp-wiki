* Both reducers and effects are called actions.
* Reducers are pure functions that update the model and cause the view to be rendered immediately, effects can only cause side effects, but may trigger other actions, which enables you to update the model (and render the view) asynchronously. 

