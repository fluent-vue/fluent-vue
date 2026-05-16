[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct-single.svg)](https://vshymanskyy.github.io/StandWithUkraine)

<h1 align="center">
  <img src="https://raw.githubusercontent.com/fluent-vue/docs/HEAD/src/public/assets/logo.svg" alt="fluent-vue logo" height="150" />
</h1>

<p align="center">
  Internationalization plugin for Vue.js
</p>

<p align="center">
  <a href="https://github.com/fluent-vue/fluent-vue/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/fluent-vue/fluent-vue/test.yml" alt="GitHub Workflow Status">
  </a>
  <a href="https://codecov.io/gh/fluent-vue/fluent-vue">
    <img src="https://codecov.io/gh/fluent-vue/fluent-vue/branch/main/graph/badge.svg?token=0JSSE94EGJ" alt="codecov">
  </a>
  <a href="https://github.com/fluent-vue/fluent-vue/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/fluent-vue/fluent-vue" alt="GitHub license">
  </a>
</p>

`fluent-vue` is a [Vue.js](https://vuejs.org) integration for [Fluent.js](https://github.com/projectfluent/fluent.js) - JavaScript implementation of Mozilla's [Project Fluent](https://projectfluent.org)

## 🚀 Features

- **Simple api for developers**: Just 2 methods, 1 directive and 1 component
- **Powerfull syntax for translators**: Use the entire expressive power of every language without need for changes to application source code
- **Isolation**: Locale-specific logic doesn't leak to other locales. A simple string in English can map to a complex multi-variant translation in another language
- **Seamless migration**: Works for **both** Vue 3 and 2
- **No bundler required**: Usable via CDN

## 🎉 Example

```vue
<template>
  <div>
    <div>{{ $t('hello-user', { userName }) }}</div>
    <div>{{ $t('shared-photos', { userName, photoCount, userGender }) }}</div>
  </div>
</template>

<fluent locale="en">
# Simple things are simple.
hello-user = Hello, {$userName}!

# Complex things are possible.
shared-photos =
  {$userName} {$photoCount ->
     [one] added one photo
    *[other] added {$photoCount} new photos
  } to {$userGender ->
     [male] his stream
     [female] her stream
    *[other] their stream
  }.
</fluent>
```

## 📖 Documentation

Documentation can be found here: [https://fluent-vue.demivan.me](https://fluent-vue.demivan.me)

Examples for different Vue.js versions and build systems can be found [here](https://github.com/fluent-vue/examples).

## 📦 Packages

This repository is a monorepo managed with [pnpm workspaces](https://pnpm.io/workspaces).

| Package | NPM | Source |
| ------- | --- | ------ |
| fluent-vue | [![fluent-vue](https://img.shields.io/npm/v/fluent-vue.svg)](https://www.npmjs.com/package/fluent-vue) | [packages/fluent-vue](./packages/fluent-vue) |
| unplugin-fluent-vue | [![unplugin-fluent-vue](https://img.shields.io/npm/v/unplugin-fluent-vue.svg)](https://www.npmjs.com/package/unplugin-fluent-vue) | [packages/unplugin-fluent-vue](./packages/unplugin-fluent-vue) |

## 🛠️ Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## 📄 License

[MIT License](./LICENSE) © 2020 [Ivan Demchuk](https://github.com/demivan)
