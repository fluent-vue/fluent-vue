---
description: fluent-vue-loader - official Webpack loader for fluent-vue that allows defining locale messages directly in Vue SFC files
---

# Webpack loader

**Deprecated. Use [`unplugin-fluent-vue`](/integrations/unplugin) instead.**

`fluent-vue-loader` allows you to use custom blocks in your single file components.

**Example**

<<< @/components/Simple.vue#snippet

## Instalation

1. Install `fluent-vue-loader` package

<code-group>

<code-group-item title="PNPM" active>

```shell
pnpm add fluent-vue-loader -D
```

</code-group-item>

<code-group-item title="YARN">

```shell
yarn add fluent-vue-loader --dev
```

</code-group-item>

<code-group-item title="NPM">

```shell
npm install fluent-vue-loader --save-dev
```

</code-group-item>

</code-group>

1. Configure Webpack
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
