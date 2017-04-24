# Application

To create applications use the [app](/docs/api#app) function. This is the foundation of every hyperapp. The `app` function gets passed an `options` object that describes all of the apps _knowledge_.

## Basic Application

This is an example of an application that has _knowledge_ of just a singular view containing some static HTML. When this code is evaluated then the contents of the view gets rendered to the root element (which defaults to `document.body`).

```
app({
  view: () => <h1>Hello</h1>
})
```

Obviously there is more to hyperapp than this.. Building more complex applications means passing more knowledge to the app function; options include `state`, `actions` and `events`.

A good place to start is [view and state](/docs/intro/view-and-state).
