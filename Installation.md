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

> The online REPL is not ready yet, in the meantime, use [this](https://codepen.io/jbucaran/pen/Qdwpxy) CodePen template.

## Build Pipeline

To create HyperApp applications ready for production you will be using a build pipeline.

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

It's common to use a build pipeline to transform [JSX](https://facebook.github.io/react/docs/introducing-jsx.html) or [Hyperx](https://github.com/substack/hyperx) into native HyperApp [`h`](/hyperapp/hyperapp/wiki/API#h) function calls.

The generated code is smaller and faster than the alternative: sending a parser over the wire and compiling the view in the user's browser.

JSX/Hyperx in:

```jsx
const hello = <h1 id="test">Hi.</h1>
```

Vanilla out:
```jsx
const hello = h("h1", { id: "test" }, "Hi.")
```

## Hello World

Create a new `index.html` file, copy and paste the code from the example and open it in your browser.

### JSX

```jsx
<body>
    <script src="https://unpkg.com/babel-standalone"></script>
    <script src="https://unpkg.com/hyperapp"></script>
    <script type="text/babel">
        const { h, app } = hyperapp
        /** @jsx h */

        app({
            model: "Hi.",
            view: model => <h1 ="id">{model}</h1>
        })
    </script>
</body>
```

[View online](https://rawgit.com/jbucaran/290fcba656dab0275ba86e3f6f9cc969/raw/64c7acd16af8470f120213506ccaebde194fe905/index.html).

### Hyperx

```jsx
<body>
    <script src="https://unpkg.com/hyperapp"></script>
    <script src="https://wzrd.in/standalone/hyperx"></script>
    <script>
        const { h, app } = hyperapp
        const html = hyperx(h)

        app({
            model: "Hi.",
            view: model => html`<h1>${model}</h1>`
        })
    </script>
</body>
```
[View online](https://rawgit.com/jbucaran/5cfa8c98464fe0b5a48edbae6b332b27/raw/fd27e1cb48d44e2c96714914b4ae05b70f10e33d/index.html).

### What just happened?

The browser downloaded HyperApp, Hyperx/JSX, compiled the view and run the application.

This process is slow, but it's good enough for demos and sharing examples with other people.

In the next section we'll explore how to setup a build pipeline using Browserify, Webpack and Rollup.
