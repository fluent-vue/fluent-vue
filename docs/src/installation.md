# Installation

## Compatibility

`fluent-vue` requires Vue 3 (>= 3.2). Vue 2 is no longer supported — use `fluent-vue` v3 for the last Vue 2 compatible release.

`fluent-vue` requires the following `Intl` formatters:

  - `Intl.DateTimeFormat` (standard, well-supported)
  - `Intl.NumberFormat` (standard, well-supported)
  - `Intl.PluralRules` (standard, new in ECMAScript 2018)

`Intl.PluralRules` may already be available in some engines. Usually,
however, a polyfill is required. You can use [intl-pluralrules](https://www.npmjs.com/package/intl-pluralrules) npm package for this purpose.

## Install npm packages

Add `fluent-vue` and `@fluent/bundle` to your project.

<code-group>
<code-group-item title="PNPM" active>

```shell
pnpm add fluent-vue @fluent/bundle
```

</code-group-item>

<code-group-item title="YARN">

```shell
yarn add fluent-vue @fluent/bundle
```

</code-group-item>

<code-group-item title="NPM">

```shell
npm install fluent-vue @fluent/bundle
```

</code-group-item>
</code-group>

## Configure and install Vue plugin

```js
import { createApp } from 'vue'
import { FluentBundle, FluentResource } from '@fluent/bundle'

import { createFluentVue } from 'fluent-vue'

import App from './App'

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

createApp(App)
  // Install Vue plugin
  .use(fluent)
```

## Customizing global names

You can override the default names of the global functions, directive, and component to avoid naming conflicts with other libraries or to better suit your project's naming conventions.

The `globals` option allows you to customize:

- `functions.format` - The global translation function name (default: `$t`)
- `functions.formatAttrs` - The global attributes function name (default: `$ta`)
- `component` - The component name (default: `i18n`)
- `directive` - The directive name (default: `v-t`)

```js
import { createApp } from 'vue'
import { FluentBundle, FluentResource } from '@fluent/bundle'

import { createFluentVue } from 'fluent-vue'

import App from './App'

const enBundle = new FluentBundle('en')

enBundle.addResource(new FluentResource('key = World'))

const fluent = createFluentVue({
  bundles: [enBundle],
  globals: {
    functions: {
      format: '$t',
      formatAttrs: '$ta'
    },
    component: 'i18n',
    directive: 'v-t'
  }
})

createApp(App)
  .use(fluent)
```
