# Access to localizations outside of component

To use localizations outside of Vue components your can export `FluentVue.format` and `FluentVue.formatAttrs` functions from your `fluent-vue` setup code. These functions work like `$t` and `$ta` methods respectively.

### fluent.js - fluent-vue setup code

```js FluentVue setup code
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

const bundle = new FluentBundle('en')
bundle.addResource(new FluentResource('hello-user = Hello, { $username }!'))

const fluent = createFluentVue({
  locale: 'en',
  bundles: [bundle],
})

export const $t = fluent.format
```

### Other js file

```js
import { $t } from './fluent'

const helloUser = $t('hello-user', { username: 'John Doe' })
```
