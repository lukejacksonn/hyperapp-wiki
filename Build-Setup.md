To create applications ready for production you will be using:

[Browserify]: http://browserify.org/
[Rollup]: http://rollupjs.org/
[Webpack]: https://webpack.js.org/
[Babel]: http://babeljs.io/
[Bublé]: https://buble.surge.sh/guide/
[npm]: https://www.npmjs.com/
[Yarn]: https://yarnpkg.com

* A **package manager**, e.g. [npm] or [Yarn]. It makes it easy to share and reuse third-party packages.
* A **compiler** e.g. [Babel] or [Bublé]. It transforms modern JavaScript into code compatible with older browsers.
* A **bundler**, e.g. [Webpack], [Rollup] or [Browserify]. It takes modules and their dependencies and generates a single bundle that can be delivered to the browser.

## Why?

To compile JSX or Hyperx into native HyperApp [h](/hyperapp/hyperapp/wiki/API#h) function calls.

The generated code is smaller and faster than the alternative: sending a parser over the wire and compiling the view in the user's browser. 

JSX or Hyperx in:

```jsx
const hello = <h1 id="test">Hi.</h1>
```

Vanilla out:
```jsx
const hello = h("h1", { id: "test" }, "Hi.")
```

In the next section we'll learn how to compile [[JSX]] and [[Hyperx]] for HyperApp.
