## h

Creates a virtual DOM node. A virtual DOM node is a Javascript data structure that describes a DOM element. Virtual nodes can be nested to create a virtual DOM tree.

Signature: `(tag, data, children)`.

* `tag` is a tag name, e.g. `div` or a function that returns a tree of virtual nodes.
* `data` is an object with attributes, styles, events, properties, [[Lifecycle Methods]], etc.
* `children` is an array of children virtual nodes. (Optional)

```jsx
const node = h("a", { href: "#" }, "Hi.")
```

## app

Starts the application.

Signature: `(options)`.

<pre>
app({
    <a href="#model">model</a>,
    <a href="#view">view</a>,
    <a href="#reducers">reducers</a>,
    <a href="#effects">effects</a>,
    <a href="#subscriptions">subscriptions</a>,
    <a href="#root">root</a>,
    <a href="#router">router</a>
})
</pre>


### model

The model is a primitive type, array or object that represents the entire state of your application.

This means there is a single source of truth shared across all the components in your application.

```jsx
const model = {
    title: "Hi."
}
```

### view

A view is a function that returns a virtual DOM tree. See [`h`](#h).

Signature: `(model, actions)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](#reducers) and [effects](#effects).

```jsx
const view = model => h("a", { href: "#" }, model.title)
```

To trigger actions use:

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

Reducers return a new model or part of it. If it returns part of a model, that part will be merged with the current model.

Reducers can be triggered inside a [view](#view), [effect](#effects) or [subscription](#subscriptions).

Signature: `(model, data, params)`.

* `model` is the current model.
* `data` is the data sent to the reducer.

If you are using the [router](#router), reducers use an additional argument:

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
            <button onclick={actions.sub}
                    disabled={model <= 0}>
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

Signature: `(model, actions, data, error)`.

* `model` is the current model.
* `actions` is an object used to trigger [reducers](#reducers) and effects.
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

const view = (model, actions) =>
    <button
        onclick={actions.waitThenAdd}
        disabled={model.waiting}
    >
        {model.counter}
    </button>

app({ model, view, reducers, effects })
```

[View online](http://codepen.io/jbucaran/pen/jyEKmw).

### subscriptions

Subscriptions are functions scheduled to run only once when the [DOM is ready](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded). Use a subscription to register global events, create timers, open a socket connection, attach mouse/keyboard event listeners, etc.

Signature: `(model, actions, error)`.

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
    view: model => <h1>{model.x + ", " + model.y}</h1>
})
```

[View online](http://codepen.io/jbucaran/pen/Bpyraw).

### hooks

Hooks are function handlers used to inspect your application, implement middleware, loggers, etc. There are four: `onUpdate`, `onAction`, `onRender` and `onError`.

#### onUpdate

Called before when model is updated. Signature: `(oldModel, newModel, data)`.

#### onAction

Called when an action (reducer or effect) is triggered. Signature: `(name, data)`.

#### onRender

Called before the view is rendered. Use it to overwrite the view with a different one. Signature: `(model, view) : view`. 

#### onError

Called when you use the `error` function inside a subscription or effect. If you don't use this hook, the default behavior is to throw. Signature: `(err)`.

```jsx
app({
    model: true,
    reducers: {
        doSomething: model => !model
    },
    effects: {
        boom: (model, actions, data, error) =>
            setTimeout(_ => error(Error("BOOM")), 1000)
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

[View online](http://codepen.io/jbucaran/pen/xgbzEy).


### plugins

WIP

### root

The root is the container of your application. If none is given, a `div` element is appended to `document.body` and used as the container.

```jsx
app({
    model: "Hi. I'm from main.",
    view: model => <h1>{model}</h1>,
    root: document.getElementById("main")
})
```

[View online](http://codepen.io/jbucaran/pen/JELvjO).

