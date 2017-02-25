HyperApp is versatile; you can use it to create new applications or gradually introduce it into an existing project.

The easiest way to get started with HyperApp is to grab the minified library from a CDN.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

To use a specific version of HyperApp:

```html
<script src="https://unpkg.com/hyperapp@0.5.0"></script>
```

You can also skip the installation and try HyperApp in the online REPL.

> The online REPL is a work in progress and will be available over the next weeks. In the meantime, use [this](https://codepen.io/jbucaran/pen/Qdwpxy) CodePen template.

## Build Pipeline

The best way to create HyperApp applications ready for production is using a build pipeline.

A modern build pipeline consists of:

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


### JSX and Hyperx

It's common to use a build pipeline to transform [JSX](https://facebook.github.io/react/docs/introducing-jsx.html) or [Hyperx](https://github.com/substack/hyperx)
 into native HyperApp `h` function calls.

The generated code is smaller and performs better than the alternative: sending Hyperx/JSX parser over the wire and compiling the view in the user's browser.

JSX/Hyperx in:

```jsx
const hello = <div id="test">Hi.</div>
```

Vanilla out:
```jsx
const hello = h("div", { id: "test" }, "Hi.")
```
