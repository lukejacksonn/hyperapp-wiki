JSX is an XML-like syntax extension to ECMAScript. It allows you to mix HTML and JavaScript.

JSX is not part of the ECMAScript standard, but using the appropriate tooling we can compile our JavaScript + JSX code into vanilla JavaScript that browsers understand.

JSX looks like this:

```jsx
const hello =
  <div>
    <h1>Hello.</h1>
    <button onclick=${action}>Click</button>
  </div>
```

For an in-depth introduction to JSX, visit the official [documentation](https://facebook.github.io/react/docs/introducing-jsx.html).


## Setup

To use JSX with HyperApp, we'll use a compiler to transform JSX into native HyperApp [h](/hyperapp/hyperapp/wiki/api#h) function calls and a bundler to create a single `bundle.js` file we can deliver to the browser.

In a new directory, create an `index.html` file:

```html
<!doctype html>
<html lang="en">
<head>
  <title>Hello HyperApp</title>
</head>

<body>
  <script src="bundle.js"></script>
</body>
</html>
```

And an `index.js` file:

```jsx
import { h, app } from "hyperapp"

app({
  model: "Hi.",
  view: model => <h1>{model}</h1>
})
```

Install dependencies:
<pre>
npm i -S <a href="https://www.npmjs.com/package/hyperapp">hyperapp</a>
</pre>


### Browserify

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
  <a href="https://www.npmjs.com/package/babelify">babelify</a> \
  <a href="https://www.npmjs.com/package/browserify">browserify</a> \
  <a href="https://www.npmjs.com/package/bundle-collapser">bundle-collapser</a> \
  <a href="https://www.npmjs.com/package/uglifyify">uglifyify</a> \
  <a href="https://www.npmjs.com/package/uglifyjs">uglifyjs</a>
</pre>

Create a `.babelrc` file:

```js
{
  "presets": ["es2015"],
    "plugins": [
      [
        "transform-react-jsx",
        {
          "pragma": "h"
        }
      ]
    ]
}
```

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/browserify \
  -t babelify \
  -g uglifyify \
  -p bundle-collapser/plugin index.js | uglifyjs > bundle.js
</pre>

[Get this boilerplate](https://gist.github.com/jbucaran/21bbf0bbb0fe97345505664883100706).

### Webpack

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/webpack">webpack</a> \
  <a href="https://www.npmjs.com/package/babel-core">babel-core</a> \
  <a href="https://www.npmjs.com/package/babel-loader">babel-loader</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015">babel-preset-es2015</a> \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a>
</pre>

Create a `.babelrc` file:
```js
{
  "presets": ["es2015"],
    "plugins": [
      [
        "transform-react-jsx",
        {
          "pragma": "h"
        }
      ]
    ]
}
```

Create a `webpack.config.js` file:

```js
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  }
}
```

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/webpack -p
</pre>

[Get this boilerplate](https://gist.github.com/jbucaran/6010a83891043a6e0c37a3cec684c08e).

### Rollup

Install development dependencies:
<pre>
npm i -D \
  <a href="https://www.npmjs.com/package/rollup">rollup</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-babel">rollup-plugin-babel</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-node-resolve">rollup-plugin-node-resolve</a> \
  <a href="https://www.npmjs.com/package/rollup-plugin-uglify">rollup-plugin-uglify</a> \
  <a href="https://www.npmjs.com/package/babel-preset-es2015-rollup">babel-preset-es2015-rollup</a> \
  <a href="https://www.npmjs.com/package/babel-plugin-transform-react-jsx">babel-plugin-transform-react-jsx</a>
</pre>


Create a `rollup.config.js` file:

```jsx
import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"

export default {
  plugins: [
    babel({
      babelrc: false,
      presets: ["es2015-rollup"],
      plugins: [
        ["transform-react-jsx", { pragma: "h" }]
      ]
    }),
    resolve({
      jsnext: true
    }),
    uglify()
  ]
}
```

Bundle your application:
<pre>
$(<a href="https://docs.npmjs.com/cli/bin">npm bin</a>)/rollup -cf iife -i index.js -o bundle.js
</pre>

[Get this boilerplate](https://gist.github.com/jbucaran/0c0da8f1256a0a66090151cfda777c2c).

