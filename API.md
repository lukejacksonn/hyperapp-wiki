## h

Returns a virtual node. A virtual node is a JavaScript object that describes an HTML/[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) element.

Signature: (tag, data, children).

* _tag_: a tag name, e.g. div or a function that returns a tree of virtual nodes.
* _data_: an object with attributes, styles, events, [[Lifecycle Methods]], etc.
* _children_: a string or an array of virtual nodes.

For example:
```jsx
h("a", { href: "#" }, "Hi.")
```
Returns the following object:
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

Starts an application.

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

A primitive type, array or object that represents the state of the application.

Changes in the model cause the [view](#view) to be rendered, and the model is changed by triggering [actions](#actions).

### view

A function that returns a virtual node tree. See: [h](#h), [[Hyperx]], [[JSX]].

Signature: (model, actions).

* _model_: the current model.
* _actions_: the application's [actions](#actions).

To call an action:

```jsx
actions.action(data)
```

* _data_: any data to pass to the action.
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

Functions that return a new model or a part of it. The new model is merged with the previous one to update the current model.

Signature: (model, data, actions, error).

* _model_: the current model.
* _actions_: the application's actions.
* _data_: the data passed to the action.
* _error_: a function that can be called to throw an error.

```jsx
app({
  model: 0,
  actions: {
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

Actions can be asynchronous too, e.g. writing to a database, sending requests to servers, etc. These kind of actions usually have no return value.

```jsx
app({
  model: {
    counter: 0,
    waiting: false
  },
  actions: {
    add: model => ({ counter: model.counter + 1 }),
    toggle: model => ({ waiting: !model.waiting }),
    waitThenAdd: (model, _, actions) => {
      actions.toggle()
      setTimeout(_ => {
        actions.add()
        actions.toggle()
      }, 1500)
    }
  },
  view: (model, actions) =>
    <button
      onclick={actions.waitThenAdd}
      disabled={model.waiting}
    >
      {model.counter}
    </button>
})
```

[View online](http://codepen.io/jbucaran/pen/jyEKmw).

Alternatively, an action may return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This allows chaining actions via [.then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) or use ES7 [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) functions.

### subscriptions

Functions scheduled to run once after the DOM is [ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, open a socket connection, attach mouse/keyboard event listeners, etc.

Signature: (model, actions, error).

```jsx
app({
  model: { x: 0, y: 0 },
  actions: {
    move: (_, { x, y }) => ({ x, y })
  },
  subscriptions: [
    (_, actions) =>
      addEventListener("mousemove",
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

Functions used to inspect an application, implement middleware, loggers, etc. There are four:

* _onUpdate_: Called before the model is updated. Signature: (oldModel, newModel, data).

* _onAction_: Called before an action is triggered. Signature: (action, data).

* _onRender_: Called before the [view](#view) is rendered. Return a different view to overwrite the default one. Signature: (model, view).

* _onError_: Called when the error function is used. If none is given, the default behavior is to throw. Signature: (error).

```jsx
app({
  model: true,
  actions: {
    toggle: model => !model,
    fail: (model, actions, data, err) =>
      setTimeout(_ => err("Abort, Retry, Fail!"), 1000)
  },
  hooks: {
    onError: e => console.log(`Error: ${e}`),
    onAction: (action) => console.log(`Action: ${action}`)
  },
  view: (model, actions) =>
    <div>
      <button onclick={actions.toggle}>
        Log
      </button>
      <button onclick={actions.fail}>
        Error
      </button>
    </div>
})
```

[View online](http://codepen.io/jbucaran/pen/xgbzEy).

### plugins

Functions that extend the [model](#model), add new [actions](#actions), [hooks](#hooks) or [subscriptions](#subscriptions). See the [[Router]] for a practical example.

Signature: (options).

* _options_: the options object passed to [app](#app).

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

The HTML root element of the application. If none is given, a div element is appended to [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) and used as the root.

Note that using `document.body` as root may lead to unexpected results when other elements are already
present.

```jsx
app({
  model: "Hi. I'm from main.",
  view: model => <h1>{model}</h1>,
  root: document.getElementById("main")
})
```

[View online](http://codepen.io/jbucaran/pen/JELvjO).
