---
description: Integrate powerful Fluent localization into your Nuxt 3 apps with fluent-vue
---

# Nuxt 3 integration

`fluent-vue` supports Nuxt Server-side rendering (SSR) using [unplugin-fluent-vue](./unplugin.md) package.

Nuxt module integrates both sub-plugins of `unplugin-fluent-vue` (`SFCFluentPlugin` and `ExternalFluentPlugin`) and adds Vue directive transform.

## Installation

1. Install `unplugin-fluent-vue` package

<code-group>

<code-group-item title="PNPM" active>

```shell
pnpm add unplugin-fluent-vue -D
```

</code-group-item>

<code-group-item title="YARN">

```shell
yarn add unplugin-fluent-vue --dev
```

</code-group-item>

<code-group-item title="NPM">

```shell
npm install unplugin-fluent-vue --save-dev
```

</code-group-item>

</code-group>

## Configure Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // Add fluent-vue Nuxt module
  modules: ['unplugin-fluent-vue/nuxt'],
  // Configure one or both plugins
  fluentVue: {
    external: { // Configures ExternalFluentPlugin
      locales: ['en', 'fr'],
      ftlDir: 'translations/',
    },
    sfc: { // Configures SFCFluentPlugin
      blockType: 'fluent',
    }
  },
})
```

## Implement Nuxt plugin

Nuxt plugin implementation depends on your site business logic: how to select default locale, where to store locale, etc.

Here is a simple plugin that stores currently selected locale using cookies:

```ts
// plugins/fluent-vue.ts
import { FluentBundle } from '@fluent/bundle';
import { createFluentVue } from 'fluent-vue';

export default defineNuxtPlugin((nuxt) => {
  const selectedLocale = useCookie('locale', {
    default: () => 'en'
  })

  const bundles: Record<string, FluentBundle> = {
    'en': new FluentBundle('en'),
    'fr': new FluentBundle('fr'),
  };

  const fluent = createFluentVue({
    bundles: [bundles[selectedLocale.value]],
  });

  nuxt.vueApp.use(fluent);

  return {
    provide: {
      changeLocale(locale: string) {
        selectedLocale.value = bundles.hasOwnProperty(locale) ? locale : 'en';
        fluent.bundles = [bundles[selectedLocale.value]];
      }
    }
  }
});
```