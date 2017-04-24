# View and State

As covered [previously](/intro/application), if the app function gets passed a `view` as one of the app _options_ then it renders the given view and appends it to [document.body](https://developer.mozilla.org/en-US/Web/API/Document/body) without any configuration.

## Root Element

To render an application in an element other than the document body, include the [root](/api#root) property in the app _options_. This can be especially useful if trying to integrate hyperapp as a component part of an existing architecture.

```
app({
  view: () => <h1>Hello</h1>,
  root: document.getElementById("app")
})
```

## Representing State

One of the app function's principal responsibilities is to keep the [view](/api#view) synced with the application state. The view is actually a function that accepts the current state as its first argument. The state and view are used to create a [virtual node](/virtual-nodes).

```
app({
  state: "Hi.",
  view: state => <h1>{state}</h1>
})
```

The [state](/api#state) property is used to describe your application's data model. It can be of any type (string, number, array, object, etc).

```
app({
  state: ["Hi", "Hola", "こんにちは"],
  view: state =>
    <ul>
      {state.map(greet => <li>{greet}</li>)}
    </ul>
})
```

The view function is called and the resultant virtual node re-rendered into the root element _every time the state is modified_.

The application state is immutable. The only way to modify state is to use [actions](/intro/actions) which are reducer functions that take the current state and transforms it into a new state that replaces the old state.
