# unplugin-fluent-vue

<p align="center">
  <a href="https://github.com/fluent-vue/unplugin-fluent-vue/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/fluent-vue/unplugin-fluent-vue/test.yml?branch=main" alt="GitHub Workflow Status">
  </a>
  <a href="https://codecov.io/gh/fluent-vue/unplugin-fluent-vue">
    <img src="https://codecov.io/gh/fluent-vue/unplugin-fluent-vue/branch/main/graph/badge.svg?token=0JSSE94EGJ" alt="codecov">
  </a>
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide">
  </a>
  <a href="https://github.com/fluent-vue/unplugin-fluent-vue/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/fluent-vue/unplugin-fluent-vue" alt="GitHub license">
  </a>
</p>

[fluent-vue](https://github.com/fluent-vue/fluent-vue) plugin for Vite, Webpack and Rollup (thanks to [unplugin](https://github.com/unjs/unplugin)).

It adds support for defining Fluent messages in Vue SFCs and external ftl files.

## Installation

```bash
npm install unplugin-fluent-vue --save-dev
```

## Usage

### Vite

```ts
// vite.config.js
import {
  ExternalFluentPlugin,
  SFCFluentPlugin,
} from 'unplugin-fluent-vue/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    // Choose one of the following:
    SFCFluentPlugin({ // define messages in SFCs
      blockType: 'fluent', // default 'fluent' - name of the block in SFCs
      checkSyntax: true, // default true - whether to check syntax of the messages
      parseFtl: false, // default false - whether to parse ftl files during build
    }),
    ExternalFluentPlugin({ // define messages in external ftl files
      baseDir: path.resolve('src'), // required - base directory for Vue files
      ftlDir: path.resolve('src/locales'), // required - directory with ftl files
      locales: ['en', 'da'], // required - list of locales
      checkSyntax: true, // default true - whether to check syntax of the messages
      parseFtl: false, // default false - whether to parse ftl files during build
    }),
  ],
})
```

Docs: https://fluent-vue.demivan.me/integrations/unplugin.html
