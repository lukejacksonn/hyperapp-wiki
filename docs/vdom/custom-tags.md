# Custom Tags

A custom tag is a function that returns a custom [virtual node](/docs/virtual-nodes.md).

```js
function Link(props, children) {
  return h("a", {
    href: props.href
  }, children)
}
```

To use a custom tag, pass it as the first argument to the [h](/docs/api.md#h) function.

```js
h("main", { id: "app" }, [
  h(Link, { href: "#" }, "Hi.")
])
```

Here is the generated virtual node.

```js
{
  tag: "main",
  data: {
    id: "app"
  },
  children: [{
    tag: "a",
    data: {
      href: "#"
    },
    children: ["Hi."]
  }]
}
```

## JSX

Custom tags and [JSX](/docs/jsx.md) play well together.

```jsx
const Link = (props, children) =>
  <a {...props}>{children}</a>

<main id="app">
  <Link href="#">Hi.</Link>
</main>
```
