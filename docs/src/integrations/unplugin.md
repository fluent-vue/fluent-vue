---
description: uplugin-fluent-vue - official fluent-vue plugin for Vite, Webpack and Rollup. It allows defining locale messages directly in Vue SFC files or in external ftl files.
---

# unplugin-fluent-vue

[unplugin-fluent-vue](https://github.com/fluent-vue/unplugin-fluent-vue) is a plugin for Vite, Webpack and Rollup.

Plugin consists of two parts:
 * `SFCFluentPlugin` - allows defining locale messages in Vue SFC files
 * `ExternalFluentPlugin` - allows defining locale messages in external ftl files

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

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite'
import {
  ExternalFluentPlugin,
  SFCFluentPlugin,
} from 'unplugin-fluent-vue/vite'

export default defineConfig({
  plugins: [
    vue(),
    // define messages in SFCs
    SFCFluentPlugin({
      blockType: 'fluent', // default 'fluent' - name of the block in SFCs
      checkSyntax: true, // default true - whether to check syntax of the messages
    }),
    // define messages in external ftl files
    ExternalFluentPlugin({
      locales: ['en', 'da'], // required - list of locales
      checkSyntax: true, // default true - whether to check syntax of the messages

      baseDir: path.resolve('src'), // base directory for Vue files
      ftlDir: path.resolve('src/locales'), // directory with ftl files

      // Instead of using baseDir and ftlDir you can use this function to define path to ftl file for given locale and Vue file.
      getFtlPath(locale, vuePath) {
        return path.join(options.ftlDir, locale, `${path.relative(options.baseDir, vuePath)}.ftl`)
      },
    }),
  ],
})
