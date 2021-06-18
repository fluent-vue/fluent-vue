# Webpack

`fluent-vue-loader` allows to use custom blocks in your single file componens.

1. Install `fluent-vue-loader` package

<code-group>

<code-group-item title="YARN" active>

```bash:no-line-numbers
yarn add fluent-vue-loader --dev
```

</code-group-item>

<code-group-item title="NPM">

```bash:no-line-numbers
npm install fluent-vue-loader --save-dev
```

</code-group-item>

</code-group>

2. Configure Webpack
```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        resourceQuery: /blockType=fluent/,
        loader: 'fluent-vue-loader',
      },
      // ...
    ],
  },
  // ...
}

```
