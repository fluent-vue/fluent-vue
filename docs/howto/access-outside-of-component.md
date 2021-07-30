# Access to localizations outside of component

To use localizations outside of Vue components you can export `FluentVue.format` and `FluentVue.formatAttrs` functions from your *fluent-vue* setup code. These functions work like `$t` and `$ta` component methods respectively.

### fluent.js - fluent-vue setup code

```js FluentVue setup code
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

const bundle = new FluentBundle('en')
bundle.addResource(new FluentResource('hello-user = Hello, { $username }!'))

const fluent = createFluentVue({
  bundles: [bundle],
})

// Added export
export const $t = fluent.format
```

### In another js file:

```js
import { $t } from './fluent'

const helloUser = $t('hello-user', { username: 'John Doe' })
```
