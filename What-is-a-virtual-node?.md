Virtual nodes, or vnodes, are JavaScript objects that represent DOM elements. HyperApp consumes a tree of vnodes to produce a DOM tree.

Vnodes are created via the [`h`](https://github.com/hyperapp/hyperapp#hoptions) function or indirectly via JSX or Hyperx.

```jsx
const vnode = <a href="#">Hello</a>
```
```jsx
const vnode = html`<a href="#">Hello</a>`
```
```jsx
const vnode = h("a", { href: "#" }, "Hello")

```



Hyperscript can also consume components:

// define a component
var ExampleComponent = {
    view: function(vnode) {
        return m("div", vnode.attrs, ["Hello ", vnode.children])
    }
}

// consume it
m(ExampleComponent, {style: "color:red;"}, "world")

// equivalent HTML:
// <div style="color:red;">Hello world</div>
