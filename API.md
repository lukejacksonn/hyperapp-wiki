# API

HyperApp has three named exports: [`h`](#h), [`app`](#app), and [`router`]().

```jsx
import { h, app, router } from "hyperapp"
```

In the browser; via a CDN, `hyperapp` is available in the global scope.

```jsx
const { h, app, router } = hyperapp
```

## h

Creates a virtual DOM node. A virtual DOM node is a Javascript data structure that describes a DOM element.

A nested structure of virtual nodes is called a virtual DOM tree.

`h` has the following signature: `h(tag, data, children)`.

* `tag` is a tag name, e.g. `div` or a function that returns a tree of virtual nodes.
* `data` is an object with attributes, styles, events, properties, [lifecycle methods](#lifecycle-methods), etc.
* `children` is an array of children virtual nodes. (Optional)

```jsx
const tree = h("div", {}, [
    h("button", {
        onclick: actions.add
    }, "+"),
    h("h1", {}, model),
    h("button", {
        onclick: actions.sub,
        disabled: model <= 0
    }, "-")
])
```





## app

Starts the application.

`app` has this signature: `app(options)`.

* `options` has the following properties:
  * [`model`](#model)
  * [`view`](#view)
  * [`reducers`](#reducers)
  * [`effects`](#effects)
  * [`subscriptions`](#subscriptions)
  * [`hooks`](#hooks)
  * [`root`](#root)
  * [`router`](concepts/router.md)



### model

The model is a primitive type, array or object that represents the state of your application. HyperApp applications use a single model architecture.

This means that the entire state of your application must be expressed as a single object.




### view

A view is a function that returns a virtual DOM tree. See [`h`](#h).

A view has the following signature: `(model, actions)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](#reducers) and [effects](#effects).

You can trigger actions like so:

```jsx
actions.action(data)
```

* `data` is the data you want to pass to the `action`.
* `action` is the name of a [reducer](#reducers) or [effect](#effects).


```jsx
app({
    model: true,
    reducers: {
        toggle: model => !model,
    },
    view: (model, actions) =>
        <button onclick={actions.toggle}>
            {model.toString()}
        </button>
})
```

[View online](http://codepen.io/jbucaran/pen/ZLGGzy/).




### reducers

Reducers are a kind of action. The other kind of action are [effects](#effects).

A reducer returns a new model or part of a model. If it returns part of a model, that part is merged with the current model.

```jsx
const reducers = {
  add: model => model + 1,
  sub: model => model - 1
}
```

A reducer can be triggered inside a [view](#view), [effect](#effects) or [subscription](#subscriptions).

A reducer has the following signature: `(model, data, params)`.

* `model` is the current model.
* `data` is the data sent to the reducer.

When using the [router](concepts/router.md), reducers receive an additional argument:

<a id="params"></a>

* `params` is an object with the matched route parameters.

```jsx
app({
    model: 0,
    reducers: {
        add: model => model + 1,
        sub: model => model - 1,
    },
    view: (model, actions) => (
        <div>
            <button onclick={actions.add}>
                +
      </button>
            <h1>{model}</h1>
            <button onclick={actions.sub} disabled={model <= 0}>
                -
      </button>
        </div>
    )
})
```

[View online](http://codepen.io/jbucaran/pen/zNxZLP).




### effects

Effects are a kind of action. The other kind of action are [reducers](#reducers).

Effects are used to cause side effects and are often asynchronous, like writing to a database, or sending requests to servers.

Effects have the following signature: `(model, actions, data, error)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](#reducers) and [effects](#effects).
* `data` is the data sent to the effect.
* `error` is a function you can call to throw an error.

```jsx

const wait = time =>
    new Promise(resolve =>
        setTimeout(_ => resolve(), time))

const model = {
    counter: 0,
    waiting: false
}

const view = (model, actions) =>
    <button
        onclick={actions.waitThenAdd}
        disabled={model.waiting}
    >
        {model.counter}
    </button>

const reducers = {
    add: model => ({ counter: model.counter + 1 }),
    toggle: model => ({ waiting: !model.waiting })
}

const effects = {
    waitThenAdd: (model, actions) => {
        actions.toggle()
        wait(1000)
            .then(actions.add)
            .then(actions.toggle)
    }
}

app({ model, view, reducers, effects })
```


[View online](http://codepen.io/jbucaran/pen/jyEKmw)



### subscriptions

Subscriptions are functions scheduled to run only once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, open a socket connection, attach mouse or keyboard event listeners, etc.

A subscription has the following signature: `(model, actions, error)`.

```jsx
app({
    model: { x: 0, y: 0 },
    reducers: {
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
    view: model =>
        <h1>{model.x + ", " + model.y}</h1>
})
```

[View online](http://codepen.io/jbucaran/pen/Bpyraw)



### hooks

Hooks are function handlers that can be used to inspect your application, implement middleware, loggers, etc. There are three: `onUpdate`, `onAction`, and `onError`.

#### onUpdate

Called when the model changes. Signature: `(oldModel, newModel, data)`.

#### onAction

Called when an action (reducer or effect) is triggered. Signature: `(name, data)`.

#### onError

Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature: `(err)`.

```jsx
app({
    model: true,
    reducers: {
        doSomething: model => !model
    },
    effects: {
        boom: (model, actions, data, err) =>
            setTimeout(_ => err(Error("BOOM")), 1000)
    },
    hooks: {
        onError: e => alert(e),
        onAction: name => alert(name)
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

[View online](http://codepen.io/jbucaran/pen/xgbzEy)





### root

The root is the container of your application. If none is given, a `div` element is appended to document.body and used as the container.


```jsx
app({
    model: "Hi. I'm from main.",
    view: model => <h1>{model}</h1>,
    root: document.getElementById("main")
})
```

[View online](http://codepen.io/jbucaran/pen/JELvjO)
