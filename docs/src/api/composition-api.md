---
description: useFluent method allows using translations in Vue.js components that use Composition API
---

# Composition API

::: tip Note
The function names returned by `useFluent` are always `$t` and `$ta`, regardless of any custom names set via the `globals.functions` option. If you want to use custom names, you can destructure with renaming: `const { $t: $f } = useFluent()`. See [Installation](/installation#customizing-global-names) for details about customizing global names.
:::

To allow using translations in components that use Composition API, `fluent-vue` has `useFluent` function. It returns `$t` and `$ta` functions, which are same as [`this.$t`](/api/instance-methods#t-method) and [`this.$ta`](/api/instance-methods#ta-method) instance methods in Vue components.

```vue
<script setup>
import { useFluent } from 'fluent-vue'

const { $t } = useFluent()

const message = $t('hello-world')
</script>
```
