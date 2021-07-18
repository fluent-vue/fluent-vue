rollup-plugin-fluent-vue
=================

`rollup-plugin-fluent-vue` is a Rollup plugin that allows to use custom blocks with locale messages in `fluent-vue`. It can also be used as Vite plugin

- [Instalation](#instalation)
- [Example](#example)

## Instalation

**Add `rollup-plugin-fluent-vue` to your dev-dependencies:**

For `npm` users:
```
npm install rollup-plugin-fluent-vue --save-dev
```

For `yarn` users:
```
yarn add rollup-plugin-fluent-vue --dev
```

**Add plugin to your Rollup or Vite config**

**Rollup**:

```js
import fluentPlugin from 'rollup-plugin-fluent-vue'

module.exports = {
  plugins: [
    fluentPlugin()
  ]
}
```

**Vite**:

```js
import vue from '@vitejs/plugin-vue'
import fluentPlugin from 'rollup-plugin-fluent-vue'

export default {
  plugins: [vue(), fluentPlugin()]
}
```

## Options

### blockType

Type: `string`<br>
Default: `fluent`

Custom block tag name.

## Example

Example of `App.vue` with custom block:

```vue
<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'app'
}
</script>

<fluent locale="en">
hello = hello world!
</fluent>
```
