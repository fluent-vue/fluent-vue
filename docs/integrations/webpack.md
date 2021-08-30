---
description: fluent-vue-loader - official Webpack loader for fluent-vue that allows defining locale messages directly in Vue SFC files
---

# Webpack loader

`fluent-vue-loader` allows you to use custom blocks in your single file components.

**Example**

@[code{11-33}](../components/Simple.vue)

## Instalation

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
