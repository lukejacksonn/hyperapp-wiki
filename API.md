The API reference provides detailed information of HyperApp functions. This document is not a tutorial, for a step-by-step walk-through see [[Getting Started]]. For a high-level discussion of HyperApp's Architecture see [[Concepts]].

* [h](#h-)
* [app](#app-)
  * [model](#model)
  * [view](#view)
  * [actions](#actions)
  * [subscriptions](#subscriptions)
  * [hooks](#hooks)
  * [plugins](#plugins)
  * [root](#root)
* [Lifecycle Methods](#lifecycle-methods)
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

In HyperApp applications are state machines. The entire application state 

### model

A primitive type, array or object that represents the state of the application.

The model is immutable. To understand this, you must realize your application is a 


The user interacts with a view which triggers actions. Actions produce a new model and discard the previous model. HyperApp automatically renders the view when the 



The model is immutable. The user interacts with the [view](#view) to trigger [actions](#actions) that produce a new model. HyperApp automatically renders the view when the model is updated.

### view

A function that returns a virtual node tree. See: [h](#h), [[Hyperx]], [[JSX]].

A view is a snapshot of the [model](#model) at a given time.

Signature: (model, actions).

* model: the current model.
* actions: the application's [actions](#actions).

To call an action:

```js
actions.action(data)
```

* data: any data to pass to the action.
* action: the name of the action.

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

[View online](http://codepen.io/jbucaran/pen/ZLGGzy/).

### actions

A collection of functions that describe the behavior of an application. Actions are typically used to update the [model](#model).

To update the model, an action must return a new model or a fragment of it. 

Signature: (model, data, actions, error).

* model: the current model.
* data: the data passed to the action.
* actions: the application's actions.
* error: a function that calls the onError [hook](#hooks).

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

[View online](http://codepen.io/jbucaran/pen/zNxZLP).

Actions may trigger other actions, cause side effects, e.g. writing to a database, fetching data from a server, etc. When used this way, there's usually no return value.

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

[View online](http://codepen.io/jbucaran/pen/ZeByKv?editors=0010).

Alternatively, an action may return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This allows chaining actions via [.then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) or use ES7 [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) functions.

### subscriptions

An array of functions scheduled to run once after the DOM is [ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use subscriptions to register global events, open a socket connection, etc.

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

A collection of functions used to inspect an application, implement middleware, loggers, etc. There are four:

* onUpdate: Called before the model is updated. Signature: (oldModel, newModel, data).

* onAction: Called before an action is triggered. Signature: (action, data).

* onRender: Called before the [view](#view) is rendered. Return a different view to overwrite the default one. Signature: (model, view).

* onError: Called when the error function is used. If none is given, the default behavior is to throw. Signature: (error).

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

[View online](http://codepen.io/jbucaran/pen/xgbzEy).

### plugins

An array of functions that can extend the [model](#model), add new [actions](#actions), [hooks](#hooks) or [subscriptions](#subscriptions). See the [[Router]] for a practical example.

Signature: (options).

* options: the options object passed to [app](#app).

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

> Note that using document.body as root may lead to unexpected results when other elements are already
present.

```jsx
app({
  model: "Hi. I'm from main.",
  view: model => <h1>{model}</h1>,
  root: document.getElementById("main")
})
```

[View online](http://codepen.io/jbucaran/pen/JELvjO).

## Lifecycle Methods

Functions that can be attached to [virtual nodes](hyperapp/hyperapp/wiki/api#h) in order to access a real DOM element before it is created, updated or removed.

The available methods are:

* onCreate([Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)):  Called before an element is created.

* onUpdate([Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)): Called before an element is updated.

* onRemove([Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)): Called before an element is removed.

### Examples

Simple usage.

```jsx
app({
  view: <div onCreate={element => console.log(element)}></div>
})
```

Using the [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) element.

```jsx
const repaint = (canvas, model) => {
  const context = canvas.getContext("2d")
  context.fillStyle = "white"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.beginPath()
  context.arc(model.x, model.y, 50, 0, 2 * Math.PI)
  context.stroke()
}

app({
  model: { x: 0, y: 0 },
  actions: {
    move: model => ({
      x: model.x + 1,
      y: model.y + 1,
    })
  },
  subscriptions: [
    (_, actions) => setInterval(_ => actions.move(), 60)
  ],
  view: model =>
    <canvas
      width="600"
      height="300"
      onUpdate={e => repaint(e, model)}
    />
})
```

[View online](http://codepen.io/jbucaran/pen/MJXMQZ/).


## Router [<>](https://github.com/hyperapp/hyperapp/blob/master/src/router.js)

```jsx
import { Router } from "hyperapp"
```

When using the router, you must use the [`view`](#view) as a dictionary of routes/views.

The _key_ is the route and the _value_ is the view.

* `*` match when no other route matches.

* `/` match the index route.

* `/:key` match a route using the regular expression `[A-Za-z0-9]+`. The matched parameters can be retrieved via [model.router.match](#modelroutermatch).

```jsx
// WIP 
```

[View online](https://hyperapp-routing.gomix.me)

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

[View online](https://gomix.com/#!/project/hyperapp-set-location)


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