HyperApp is versatile; you can use it to create new applications or gradually introduce it into an existing project.

The easiest way to get started with HyperApp is to grab the minified library from a CDN.

```html
<script src="https://unpkg.com/hyperapp"></script>
```

To use a specific version of HyperApp:

```html
<script src="https://unpkg.com/hyperapp@0.7.0"></script>
```

You can also skip the installation and try HyperApp in the online REPL.

> The online REPL is not ready yet, in the meantime, use [this CodePen template](https://codepen.io/jbucaran/pen/Qdwpxy).

## Hello World

Create a new `index.html` file, copy and paste the code from the example and open it in your browser.

### JSX

```jsx
<body>
  <script src="https://unpkg.com/hyperapp"></script>
  <script src="https://unpkg.com/babel-standalone"></script>
  <script type="text/babel">

  const { h, app } = hyperapp
  /** @jsx h */

  app({
    model: "Hi.",
    view: model => <h1 id="title">{model}</h1>
  })

  </script>
</body>
```

[View Online](https://rawgit.com/jbucaran/290fcba656dab0275ba86e3f6f9cc969/raw/7cb90ea423b17d7d0625bacad95d22ed0ce70158/index.html)

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
[View Online](https://rawgit.com/jbucaran/5cfa8c98464fe0b5a48edbae6b332b27/raw/fd27e1cb48d44e2c96714914b4ae05b70f10e33d/index.html)

### What just happened?

The browser downloaded HyperApp with Hyperx or JSX, compiled the view and ran the application.

This workflow is great for demos and sharing examples with other people, but not so great for a production application.

In the next section we'll explore how to create a [[Build Setup]] using Browserify, Webpack and Rollup.
