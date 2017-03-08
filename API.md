The API reference provides detailed information about HyperApp module exports. This document is not a tutorial, for a step-by-step walk-through see [[Getting Started]]. For a high-level discussion of HyperApp see [[Concepts]].

* [h](#h-)
* [app](#app-)
  * [model](#model)
  * [view](#view)
  * [actions](#actions)
  * [subscriptions](#subscriptions)
  * [hooks](#hooks)
  * [plugins](#plugins)
  * [root](#root)
* [Router](#router-)

## [h](#h- "Hyperscript-style virtual node factory function") [<>](https://github.com/hyperapp/hyperapp/blob/master/src/h.js "View Source")

Returns a virtual node. A virtual node is a JavaScript object that describes an HTML/[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) element tree.

Signature: (<a href="#h_tag">tag</a>, <a href="#h_data">data</a>, <a href="#h_children">children</a>).

* <a name="h_tag"></a>**tag**: a tag name, e.g. div or a function that returns a tree of virtual nodes.
* <a name="h_data"></a>**data**: an object with attributes, styles, events, [[Lifecycle Methods]], etc.
* <a name="h_children"></a>**children**: a string or an array of virtual nodes.

For example:
```js
h("a", { href: "#" }, "Hi.")
```
Returns the following object:
```js
{
  tag: "a",
  data: {
    href: "#"
  }
  children: "Hi."
}
```

## [app](#app- "app") [<>](https://github.com/hyperapp/hyperapp/blob/master/src/app.js)

Starts an application with options. 

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

### view

A function that returns a virtual node tree. See: [h](#h), [[Hyperx]], [[JSX]].

Signature: (<a href="#view_model">model</a>, <a href="#view_actions">actions</a>).

* <a name="view_model"></a>**model**: the current model.
* <a name="view_actions"></a>**actions**: the application's [actions](#actions).

To call an action:

<pre>
<i>actions</i>.<a href="#view_actions_action"><b>action</b></a>(<i><a href="#view_actions_data">data</a></i>)
</pre>

* <a name="view_actions_action"></a>**action**: the name of the action.
* <a name="view_actions_data"></a>**data**: any data to pass to the action.

```jsx
app({
  model: true,
  actions: {
    toggle: model => !model,
  },
  view: (model, actions) =>
    <button onClick={actions.toggle}>
      {model.toString()}
    </button>
})
```

[View Online](http://codepen.io/jbucaran/pen/ZLGGzy/)

### actions

A collection of functions that describe the behavior of an application. Actions are typically used to update the [model](#model).

To update the model, actions return a new model or a fragment of it. 

Signature: (<a href="#actions_model">model</a>, <a href="#actions_data">data</a>, <a href="#actions_actions">actions</a>, <a href="#actions_error">error</a>).

* <a name="actions_model"></a>**model**: the current model.
* <a name="actions_data"></a>**data**: the data passed to the action.
* <a name="actions_actions"></a>**actions**: the application's actions.
* <a name="actions_error"></a>**error**: a function that calls the onError [hook](#hooks).

```jsx
app({
  model: 0,
  actions: {
    add: model => model + 1,
    sub: model => model - 1,
  },
  view: (model, actions) =>
    <div>
      <button onClick={actions.add}>
        +
      </button>
      <h1>{model}</h1>
      <button onClick={actions.sub}
        disabled={model <= 0}>
        -
      </button>
    </div>
})
```

[View Online](http://codepen.io/jbucaran/pen/zNxZLP)

Actions can trigger other actions, cause side effects, e.g. writing to a database, fetching data from a server, etc. When used this way, there's usually no return value.

```jsx
app({
  model: {
    url: "",
    isFetching: false
  },
  actions: {
    search: (model, { target }, actions) => {
      const text = target.value

      if (model.isFetching || text === "") {
        return
      }

      actions.toggleFetching()
      fetch(`//api.giphy.com/v1/gifs/search?q=${text}&api_key=dc6zaTOxFJmzC`)
        .then(data => data.json())
        .then(({ data }) => {
          actions.toggleFetching()
          data[0] && actions.setUrl(data[0].images.original.url)
        })
    },
    setUrl: (_, url) => ({ url }),
    toggleFetching: model => ({ isFetching: !model.isFetching })
  },
  view: (model, actions) =>
    <div>
      <input
        type="text"
        placeholder="Type to search..."
        onKeyUp={actions.search}
      />
      <div>
        <img
          src={model.url}
          style={{
            display: !model.url || model.isFetching ? "none" : "block"
          }}
        />
      </div>
    </div>
})
```

[View Online](http://codepen.io/jbucaran/pen/ZeByKv?editors=0010)

Actions can also return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This enables you to chain actions using [.then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) or use ES7 [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) functions.

```jsx
app({
  model: 0,
  actions: {
    add: model => model + 1,
    delay: (model, time) => 
      new Promise(_ => setTimeout(_, time)),   
    async slowlyAdd(model, time, actions) {
      await actions.delay(time)
      actions.add()
    }
  },
  view: (model, actions) => 
    <button
      onClick={_ => actions.slowlyAdd(1000)}
    >
      {model}
    </button>,
})
```

[View Online](http://codepen.io/jbucaran/pen/jByPNd?editors=0010)

### subscriptions

An array of functions scheduled to run once after the DOM is [ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use subscriptions to register global events, open a socket connection, etc.

Signature: (<a href="#subs_model">model</a>, <a href="#subs_actions">actions</a>, <a href="#subs_error">error</a>).

* <a name="subs_model"></a>**model**: the current model.
* <a name="subs_actions"></a>**actions**: the application's actions.
* <a name="subs_error"></a>**error**: a function that calls the onError [hook](#hooks).

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

[View Online](http://codepen.io/jbucaran/pen/Bpyraw)

### hooks

A collection of functions used to inspect an application, implement middleware, loggers, etc. 

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
      <button onClick={actions.toggle}>
        Log
      </button>
      <button onClick={actions.fail}>
        Error
      </button>
    </div>
})
```

[View Online](http://codepen.io/jbucaran/pen/xgbzEy)

#### onAction

A function called before an action is triggered. 

Signature: (<a href="#onaction_action">action</a>, <a href="#onaction_data">data</a>).

* <a name="onaction_action"></a>**action**: the name of the action.
* <a name="onaction_data"></a>**data**: the data passed to the action.

#### onUpdate

A function called before the [model](#model) is updated. 

Signature: (<a href="#onupdate_oldmodel">oldModel</a>, <a href="#onupdate_newmodel">newModel</a>, <a href="#onupdate_data">data</a>).

* <a name="onupdate_oldmodel"></a>**oldModel**: the previous/current model. 
* <a name="onupdate_newmodel"></a>**newModel**: the next model.
* <a name="onupdate_data"></a>**data**: the data merged to update the model.

#### onRender

A function called before the [view](#view) is rendered. You can use this hook to overwrite the default view by returning a different view function. See: [Router](#router-).

Signature: (<a href="#onrender_model">model</a>, <a href="#onrender_view">view</a>).

* <a href="onrender_model"></a>**model**: the current model.
* <a href="onrender_view"></a>**view**: the view function.

#### onError

A function called when the error argument passed to actions or subscriptions is used. If none is given, the default behavior is to throw. 

Signature: (<a href="#onerror_error">error</a>).

* <a name="onerror_error"></a>**error**: the error message.

### plugins

An array of functions that can extend the [model](#model), add new [actions](#actions), [hooks](#hooks) or [subscriptions](#subscriptions). For a practical example see: [Router](#router-).

Signature: (options).

<pre>
MyPlugin({ 
  <a href="#model">model</a>, 
  <a href="#actions">actions</a>, 
  <a href="#subscriptions">subscriptions</a>, 
  <a href="#hooks">hooks</a> 
})
</pre>

For example:

```jsx
const ActionLogger = options => ({
  hooks: {
    onAction: action => console.log(`Action: ${action}`)
  }
})

app({
  model: 0,
  actions: {
    tick: model => model + 1
  },
  plugins: [ActionLogger],
  subscriptions: [
    (_, actions) => setInterval(_ => actions.tick(), 1000)
  ],
  view: model => <h1>{model}</h1>
})
```

[View Online](http://codepen.io/jbucaran/pen/zZNvgM?editors=0011)

### root

The HTML root element of the application. If none is given, a div element is appended to [document.body](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) and used as the root.

> Currently you can't use document.body as a root element.

```jsx
app({
  model: "Hi. I'm from main.",
  view: model => <h1>{model}</h1>,
  root: document.getElementById("main")
})
```

[View Online](http://codepen.io/jbucaran/pen/JELvjO)

## Router [<>](https://github.com/hyperapp/hyperapp/blob/master/src/router.js)

```jsx
import { Router } from "hyperapp"
```

When using the router, you must use the [view](#view) as a dictionary of routes/views.

The _key_ is the route and the _value_ is the view.

* `*` match when no other route matches.

* `/` match the index route.

* `/:key` match a route using the regular expression `[A-Za-z0-9]+`. The matched parameters can be retrieved via [model.router.match](#modelroutermatch).

```jsx
// WIP 
```

[View Online](https://hyperapp-routing.gomix.me

### actions.router.go

Call `actions.router.go(path)` to update the [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location). If the path matches an existing route, the corresponding view will be rendered. 

```jsx
app({
  view: {
    "/": (model, actions) =>
      <div>
        <h1>Home</h1>
        <button
          onclick={_ => actions.router.go("/about")}>
          About
        </button>
      </div>,

    "/about": (model, actions) =>
      <div>
        <h1>About</h1>
        <button
          onclick={_ => actions.router.go("/")}>
          Home
        </button>
      </div>
  },
  plugins: [Router]
})
```

[View Online](https://gomix.com/#!/project/hyperapp-set-location


### model.router.match

Matched route.

```jsx
// route /user/:id/posts/:postId
// url /user/7a45h2/posts/9df081
model.router.match = '/user/:id/posts/:postId'
```

### model.router.params

Matched route params.

```jsx
// route /user/:id/posts/:postId
// url /user/7a45h2/posts/9df081
model.router.params = {
  id: '7a45h2',
  postId: '9df081'
}
```