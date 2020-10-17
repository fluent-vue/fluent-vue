fluent-vue-loader
=================

`fluent-vue-loader` is Webpack loader that allows to use custom blocks with locale messages in `fluent-vue`

<!-- TOC depthfrom:2 -->

- [Instalation](#instalation)
- [Example](#example)

<!-- /TOC -->

## Instalation

**Add `fluent-vue-loader` to your dev-dependencies:**

For `npm` users:
```
npm install fluent-vue-loader --save-dev
```

For `yarn` users:
```
yarn add fluent-vue-loader --dev
```

**Add loader to your webpack config**

```js
module.exports = {
  module: {
    rules: [
      // ...
      {
        resourceQuery: /blockType=i18n/,
        loader: 'fluent-vue-loader',
      },
      // ...
    ]
  }
}
```

## Example

Example of `App.vue` with `i18n` custom block:

```vue
<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'app'
}
</script>

<i18n locale="en">
hello = hello world!
</i18n>
```
