The API reference provides detailed information about HyperApp module exports. This document is not a tutorial, for a step-by-step walk-through see [[Getting Started]]. For a high-level discussion of HyperApp see [[Concepts]].

* [h](#h "Hyperscript-style virtual node factory function")
* [app](#app)
  * [model](#model)
  * [view](#view)
  * [actions](#actions)
  * [subscriptions](#subscriptions)
  * [hooks](#hooks)
  * [plugins](#plugins)
  * [root](#root)
* [Router](#router)

## <a name="h"></a>[#](#h) h [<>](https://github.com/hyperapp/hyperapp/blob/master/src/h.js "View Source")

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

## <a name="app"></a>[#](#app) app [<>](https://github.com/hyperapp/hyperapp/blob/master/src/app.js "View Source")

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

### <a name="model"></a>[#](#model) model

A primitive type, array or object that represents the state of the application.

### <a name="view"></a>[#](#view) view

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

### <a name="actions"></a>[#](#actions) actions

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

Actions can also return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). This enables you use ES7 [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) functions.

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

### <a name="subscriptions"></a>[#](#subscriptions) subscriptions

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

### <a name="hooks"></a>[#](#hooks) hooks

A collection of functions that can be used to inspect an application, implement middleware, etc. 

<a name="onaction"></a>[#](#onaction) _hooks_.**onAction**(<a href="#onaction_action">action</a>, <a href="#onaction_data">data</a>)

Called before an action is triggered. 

* <a name="onaction_action"></a>**action**: the name of the action.
* <a name="onaction_data"></a>**data**: the data passed to the action.

<a name="onupdate"></a>[#](#onupdate) _hooks_.**onUpdate**(<a href="#onupdate_oldmodel">oldModel</a>, <a href="#onupdate_newmodel">newModel</a>, <a href="#onupdate_data">data</a>)

Called before the model is updated. 

* <a name="onupdate_oldmodel"></a>**oldModel**: the previous/current model. 
* <a name="onupdate_newmodel"></a>**newModel**: the next model.
* <a name="onupdate_data"></a>**data**: the data merged to update the model.

<a name="onrender"></a>[#](#onrender) _hooks_.**onRender**(<a href="#onrender_model">model</a>, <a href="#onrender_view">view</a>)

Called before the [view](#view) is rendered. You can use this hook to overwrite the default view by returning a different view function. See: [Router](#router-).

* <a name="onrender_model"></a>**model**: the current model.
* <a name="onrender_view"></a>**view**: the view function.

<a name="onerror"></a>[#](#onerror) _hooks_.**onError**(<a href="#onerror_error">error</a>)

Called when the error argument passed to actions or subscriptions is used. If none is given, the default behavior is to throw. 

* <a name="onerror_error"></a>**error**: the error message.

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

### <a name="plugins"></a>[#](#plugins) plugins

An array of functions that can extend the [model](#model), add new [actions](#actions), [hooks](#hooks) or [subscriptions](#subscriptions) to an application. See [[Plugins]] for examples.

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
const MyLogger = options => ({
  hooks: {
    onAction: action => console.log(`Action: ${action}`)
  }
})

app({
  model: 0,
  actions: {
    tick: model => model + 1
  },
  plugins: [MyLogger],
  subscriptions: [
    (_, actions) => setInterval(_ => actions.tick(), 1000)
  ],
  view: model => <h1>{model}</h1>
})
```

[View Online](http://codepen.io/jbucaran/pen/zZNvgM?editors=0011)

### <a name="root"></a>[#](#root) root

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

## <a name="Router"></a>[#](#Router) Router [<>](https://github.com/hyperapp/hyperapp/blob/master/src/router.js "View Source")

When using the router, the [view](#view) is a dictionary of routes/views.

The _key_ is the route and the _value_ is the view function.

* `*` match when no other route matches.
* `/` match the index route.
* `/:key` match a route using the regular expression [A-Za-z0-9]+. The matched parameters are stored in [model.router.params](#router_params).

<a name="router_go"></a>[#](#router_go) _actions_.**router**.**go**(_path_)

Sets the [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location) to the given path. If the path matches an existing route, the corresponding view will be rendered. 

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

[View Online](https://hyperapp-router-go.gomix.me)

<a name="router_match"></a>[#](#router_match) _model_._**router**_.**match**

<table>
  <th>Route</th>
  <th colspan=3>URL</th>

  <tr>
    <td>*</td>
    <td>/foo</td>
    <td>/foo/bar/baz</td>
  </tr>

  <tr>
    <td>/:key</td>
    <td>/foo</td>
    <td>/bar</td>
  </tr>

  <tr>
    <td>/item/:id</td>
    <td>/item/7a45</td>
    <td>/item/1c63</td>
  </tr>

  <tr>
    <td>/user/:name/post/:id</td>
    <td>/user/hyper/post/9df0</td>
    <td>/user/app/post/5ag1</td>
  </tr>
</table>


<a name="router_params"></a>[#](#router_params) _model_._**router**_.**params**

<table>
  <th>Route</th>
  <th>URL</th>
  <td><i>params</i>.<b>name</b></td>
  <td><i>params</i>.<b>id</b></td>

  <tr>
    <td>/user/:name/post/:id</td>
    <td>/user/hyper/post/9df0</td>
    <td>hyper</td>
    <td>9df0</td>
  </tr>

  <tr>
    <td>/user/:name/post/:id</td>
    <td>/user/app/post/5ag1</td>
    <td>app</td>
    <td>5ag1</td>
  </tr>
</table>

