* Both reducers and effects are called actions.
* Reducers are pure functions that update the model and cause the view to be rendered immediately, effects can cause side effects and don't cause the view to be rendered.
* Effects may trigger other actions, which enables you to update the model asynchronously. 

