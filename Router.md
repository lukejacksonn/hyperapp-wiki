```jsx
import { Router } from "hyperapp"
```

When using the router, you must use the [`view`](#view) as a dictionary of routes/views.

The _key_ is the route and the _value_ is the [view](#view).

* `*` match when no other route matches.

* `/` match the index route.

* `/:key` match a route using the regular expression `[A-Za-z0-9]+`. The matched key is passed to the [view](#view) function via [`params`](#modelrouterparams).

```jsx
...
```

[View online](https://hyperapp-routing.gomix.me)


## actions.router.go

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