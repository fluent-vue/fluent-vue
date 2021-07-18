# Rollup

Rollup support for custom blocks in SFC is provided by [rollup-plugin-fluent-vue](https://www.npmjs.com/package/rollup-plugin-fluent-vue).

```js
import vue from 'rollup-plugin-vue'
import fluentPlugin from 'rollup-plugin-fluent-vue'

module.exports = {
  plugins: [
    vue({
      customBlocks: ['fluent']
    }),
    fluentPlugin()
  ]
};
```

## Options

### blockType

Type: `string`<br>
Default: `fluent`

Custom block tag name.
