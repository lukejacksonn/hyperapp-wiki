The API reference provides detailed information HyperApp exports. This document is not a tutorial, for a step-by-step walk-through see [[Getting Started]].

* [h](#-h-) 
* [app](#-app-) 
  * [model](#-model-)
  * [view](#-view-)
  * [actions](#-actions-)
  * [subscriptions](#-subscriptions-)
  * [hooks](#-hooks-)
  * [plugins](#-plugins-)
  * [root](#-root-)
* [Router](#-router-)

## [#](#-h-) h [<>](https://github.com/hyperapp/hyperapp/blob/master/src/h.js)

Returns a virtual node. A virtual node is a JavaScript object that describes an HTML/[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) element.

Signature: (tag, data, children).

* tag: a tag name, e.g. div or a function that returns a tree of virtual nodes.
* data: an object with attributes, styles, events, [[Lifecycle Methods]], etc.
* children: a string or an array of virtual nodes.

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

## [#](#-app-) app [<>](https://github.com/hyperapp/hyperapp/blob/master/src/app.js)

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

### [#](#-model-) model

A primitive type, array or object that represents the state of the application.

Changes in the model cause the [view](#view) to be rendered, and the model is changed by triggering [actions](#actions).

### view

A function that returns a virtual node tree. See: [h](#h), [[Hyperx]], [[JSX]].

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

## [#](#-router-) Router [<>](https://github.com/hyperapp/hyperapp/blob/master/src/router.js)

```jsx
import { Router } from "hyperapp"
```

When using the router, you must use the [`view`](#view) as a dictionary of routes/views.

The _key_ is the route and the _value_ is the [view](#view).

* `*` match when no other route matches.

* `/` match the index route.

* `/:key` match a route using the regular expression `[A-Za-z0-9]+`. The matched parameters can be accessed in [model.router.match](#modelroutermatch).

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


## model.router.match

Matched route.

```javascript
// route /user/:id/posts/:postId
// url /user/7a45h2/posts/9df081
model.router.match = '/user/:id/posts/:postId'
```

## model.router.params

Matched route params.

```javascript
// route /user/:id/posts/:postId
// url /user/7a45h2/posts/9df081
model.router.params = {
	id: '7a45h2',
	postId: '9df081'
}
```