# Webpack

`fluent-vue-loader` allows to use `i18n` custom blocks in your single file componens.

Example:

<<< @/components/Simple.vue#snippet

1. Install `fluent-vue-loader` package

<code-group>

<code-block title="YARN" active>
```bash
yarn add fluent-vue-loader --dev
```
</code-block>

<code-block title="NPM">
```bash
npm install fluent-vue-loader --save-dev
```
</code-block>

</code-group>

2. Configure Webpack
```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        resourceQuery: /blockType=i18n/,
        loader: 'fluent-vue-loader',
      },
      // ...
    ],
  },
  // ...
}

```
