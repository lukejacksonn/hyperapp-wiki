The JSX pragma is a regular comment in your code that looks like this:

```jsx
/** @jsx h */
```

and helps your compiler ([Babel](https://babeljs.io)/[Buble](https://buble.surge.sh/guide)) transform JSX into [`h`]() function calls.
