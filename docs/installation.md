# Installation

## Compatibility

`fluent-vue` is compatible both with Vue 2 and Vue 3.

`fluent-vue` requires the following `Intl` formatters:

  - `Intl.DateTimeFormat` (standard, well-supported)
  - `Intl.NumberFormat` (standard, well-supported)
  - `Intl.PluralRules` (standard, new in ECMAScript 2018)

`Intl.PluralRules` may already be available in some engines. Usually,
however, a polyfill is required. You can use [polyfill.io](https://polyfill.io) service or [intl-pluralrules](https://www.npmjs.com/package/intl-pluralrules) npm package for this purpose.

## Install npm packages

Add `fluent-vue` and `@fluent/bundle` to your project.

<code-group>

<code-group-item title="YARN" active>

```bash:no-line-numbers
yarn add fluent-vue @fluent/bundle
```

</code-group-item>

<code-group-item title="NPM">

```bash:no-line-numbers
npm install fluent-vue @fluent/bundle
```

</code-group-item>

</code-group>

#### Note:
If you are using `Vue` version 2 you need to install `@vue/composition-api`

<code-group>
<code-group-item title="YARN" active>

```bash:no-line-numbers
yarn add @vue/composition-api
```

</code-group-item>
<code-group-item title="NPM">

```bash:no-line-numbers
npm install @vue/composition-api
```

</code-group-item>
</code-group>

## Configure and install Vue plugin

```js
import Vue from 'vue';
import { FluentBundle, FluentResource } from '@fluent/bundle';

import { createFluentVue } from 'fluent-vue'

// Create bundles for locales that will be used
const enBundle = new FluentBundle('en')
const ukBundle = new FluentBundle('uk')

// Add global resources to the bundles
enBundle.addResource(new FluentResource('key = World'))
enBundle.addResource(new FluentResource('another-key = Hello, {$name}'))

// Create plugin istance
// bundles - The current negotiated fallback chain of languages
const fluent = createFluentVue({
  bundles: [enBundle, ukBundle]
})

// Install Vue plugin
Vue.use(fluent)
```
