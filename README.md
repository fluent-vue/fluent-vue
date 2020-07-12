# fluent-vue

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Known Vulnerabilities](https://snyk.io/test/github/Demivan/fluent-vue/badge.svg)](https://snyk.io/test/github/Demivan/fluent-vue)
[![Travis](https://img.shields.io/travis/Demivan/fluent-vue.svg)](https://travis-ci.org/Demivan/fluent-vue)
[![Coveralls](https://img.shields.io/coveralls/Demivan/fluent-vue.svg)](https://coveralls.io/github/Demivan/fluent-vue)
[![Dev Dependencies](https://david-dm.org/Demivan/fluent-vue/dev-status.svg)](https://david-dm.org/Demivan/fluent-vue?type=dev)

Vue.js integration for Project Fluent.

**Project is in beta state. I don't recommend using it in production just yet, but would greatly appreciate any feedback.**

<!-- TOC depthfrom:2 -->

- [Features](#features)
	- [`$t` method - simple way of adding translations](#t-method---simple-way-of-adding-translations)
	- [`$ta` method - gets all attributes for translation key](#ta-method---gets-all-attributes-for-translation-key)
	- [`v-t` directive - binds all whitelisted attributes](#v-t-directive---binds-all-whitelisted-attributes)
	- [`i18n` component - allows using components inside translations](#i18n-component---allows-using-components-inside-translations)
- [Instalation](#instalation)

<!-- /TOC -->

## Features

### `$t` method - simple way of adding translations

Resources:
```
aria-key = Aria value
greeting = Hello, {$name}
```

Template:
```html
<div :aria-label="$t('aria-key')">{{ $t('greeting', { name: 'World' }) }}</div>
```

Result:
```html
<div aria-label="Aria value">Hello, ⁨World⁩</div>
```

### `$ta` method - gets all attributes for translation key
Useful for binding translations to custom components

Resources:
```
greeting = Hello, {$name}
  .aria-label = Label value
```

Template:
```html
<div v-bind="$ta('greeting')">{{ $t('greeting', { name: 'World' }) }}</div>
```

Result:
```html
<div aria-label="Aria value">Hello, ⁨World⁩</div>
```

### `v-t` directive - binds all whitelisted attributes

Resources:
```
greeting = Hello, {$name}
  .aria-label = Label value
```

Template:
```html
<div v-t:greeting="{ name: 'World' }"></div>
```

Result:
```html
<div aria-label="Label value">Hello, ⁨World⁩</div>
```

### `i18n` component - allows using components inside translations

Resources:
```
greeting = Hello, {$name}
```

Template:
```html
<i18n path="greeting" tag="div">
  <template #name>
    <b>World</b>
  </template>
</i18n>
```

Result:
```html
<div>Hello, ⁨<b>World</b>⁩</div>
```

## Instalation

**Add `fluent-vue` and `@fluent/bundle` to your project:**

For `npm` users:
```
npm install fluent-vue @fluent/bundle
```

For `yarn` users:
```
yarn add fluent-vue @fluent/bundle
```

**Install Vue and configure plugin**

```js
import Vue from 'vue';
import { FluentBundle, FluentResource } from '@fluent/bundle';

import { createFluentVue } from 'fluent-vue' 
 
// Create bundle
const bundle = new FluentBundle('en')

// Add resources to the bundle 
bundle.addResource(new FluentResource('key = World'))
bundle.addResource(new FluentResource('another-key = Hello, {$name}'))

// Create fluent istance
const fluent = createFluentVue({
  locale: 'en',
  bundles: [bundle]
})

// Add Vue plugin
Vue.use(fluent)
```
