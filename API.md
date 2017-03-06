## h

Creates a virtual node. A virtual node is a JavaScript object that describes an HTML/[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) element. 

Signature: (tag, data, children).

* _tag_: a tag name, e.g. div or a function that returns a tree of virtual nodes.
* _data_: an object with attributes, styles, events, [[Lifecycle Methods]], etc.
* _children_: a string or an array of virtual nodes. 

For example:
```jsx
h("a", { href: "#" }, "Hi.")
```
Creates a virtual node:
```jsx
{
  tag: "a",
  data: {
    href: "#"
  }
  children: "Hi."
}
```

## app

Starts the application.

Signature: (options).

<pre>
app({
  <a href="#model">model</a>,
  <a href="#view">view</a>,
  <a href="#actions">actions</a>,
  <a href="#subscriptions">subscriptions</a>,
  <a href="#plugins">plugins</a>,
  <a href="#root">root</a>
})
</pre>


### model

The model is a primitive type, array or object that represents the entire state of your application.

When the model changes, the [view](#view) is rendered and to change the model, you must call [actions](#actions).

### view

A view is a function that returns a virtual node. 

Signature: (model, actions).

* _model_: the current model.
* _actions_: your application's [actions](#actions).

```jsx
const view = model => h("a", { href: "#" }, model.title)
```

To call an action:

```jsx
actions.action(data)
```

* _data_: any data you want to pass to the action.
* _action_: the name of the action.

```jsx
app({
  model: true,
  actions: {
    toggle: model => !model,
  },
  view: (model, actions) =>
    <button onclick={actions.toggle}>
      {model.toString()}
    </button>
})
```

[View online](http://codepen.io/jbucaran/pen/ZLGGzy/).

### actions

Actions are used to update the model, which in turn causes the view to be rendered.

To update the model, an action returns a new model or a part of it, which is then merged with the previous model.

Signature: (model, data, actions, error).

* _model_: the current model.
* _actions_: your application's actions.
* _data_: the data passed to the action.
* _error_: a function you can call to throw an error.

```jsx
app({
  model: 0,
  reducers: {
    add: model => model + 1,
    sub: model => model - 1,
  },
  view: (model, actions) =>
    <div>
      <button onclick={actions.add}>
        +
      </button>
      <h1>{model}</h1>
      <button onclick={actions.sub}
        disabled={model <= 0}>
        -
      </button>
    </div>
})
```

[View online](http://codepen.io/jbucaran/pen/zNxZLP).

Actions can cause [[Side Effects]] too, like writing to a database, or sending requests to servers. These kind of actions are often asynchronous in nature, so they have no return value. Alternatively, you may return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This allows you to chain actions using [.then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) or use [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) functions.

### subscriptions

Subscriptions are functions scheduled to run once after the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, open a socket connection, attach mouse/keyboard event listeners, etc.

Signature: (model, actions, error).

```jsx
app({
  model: { x: 0, y: 0 },
  actions: {
    move: (_, { x, y }) => ({ x, y })
  },
  subscriptions: [
    (_, actions) =>
      addEventListener(
        "mousemove",
        e => actions.move({
          x: e.clientX,
          y: e.clientY,
        })
      )
  ],
  view: model => <h1>{model.x + ", " + model.y}</h1>
})
```

[View online](http://codepen.io/jbucaran/pen/Bpyraw).

### hooks

Hooks are function handlers used to inspect your application, implement middleware, loggers, etc. There are four:

* _onUpdate_: Called before the model is updated. Signature: (oldModel, newModel, data).

* _onAction_: Called before an action is triggered. Signature: (action, data).

* _onRender_: Called before the [view](#view) is rendered. Return a view to overwrite the default one. Signature: (model, view). 

* _onError_: Called when you use the error function inside a subscription or action. If you don't use this hook, the default behavior is to throw. Signature: (error).

```jsx
app({
  model: true,
  actions: {
    doSomething: model => !model
  },
  effects: {
    boom: (model, actions, data, error) =>
      setTimeout(_ => error(Error("Errors be bold!")), 1000)
  },
  hooks: {
    onError: error => alert(error),
    onAction: action => alert(action)
  },
  view: (model, actions) =>
    <div>
      <button onclick={actions.doSomething}>
        Log
      </button>
      <button onclick={actions.boom}>
        Error
      </button>
    </div>
})
```

[View online](http://codepen.io/jbucaran/pen/xgbzEy).

### plugins

Plugins are functions that enhance your application by extending the [model](#model) and adding new [actions](#actions), [hooks](#hooks) or [subscriptions](#subscriptions).

Signature: (options).

* _options_: the original options object passed to [app](#app).

```jsx
cont Logger = options => ({
  hooks: {
    onAction: name => console.log(name)
  }
})

app({
  plugins: [Logger]
})
```

### root

The root is the container of your application. If none is given, a `div` element is appended to `document.body` and used as root.

```jsx
app({
  model: "Hi. I'm from main.",
  view: model => <h1>{model}</h1>,
  root: document.getElementById("main")
})
```

[View online](http://codepen.io/jbucaran/pen/JELvjO).

