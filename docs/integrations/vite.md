---
description: rollup-plugin-fluent-vue - official Vite plugin for fluent-vue that allows defining locale messages directly in Vue SFC files
---

# Vite plugin

Vite support for custom blocks in SFC is provided by [rollup-plugin-fluent-vue](https://www.npmjs.com/package/rollup-plugin-fluent-vue).

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
