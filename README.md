[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct-single.svg)](https://vshymanskyy.github.io/StandWithUkraine)

<h1 align="center">
  <img src="https://raw.githubusercontent.com/fluent-vue/docs/HEAD/src/assets/logo.svg" alt="fluent-vue logo" />
</h1>

<p align="center">
  Internationalization plugin for Vue.js
</p>

<p align="center">
  <a href="https://github.com/Demivan/fluent-vue/actions">
    <img src="https://img.shields.io/github/workflow/status/demivan/fluent-vue/Test" alt="GitHub Workflow Status">
  </a>
  <a href="https://codecov.io/gh/Demivan/fluent-vue">
    <img src="https://codecov.io/gh/Demivan/fluent-vue/branch/main/graph/badge.svg?token=0JSSE94EGJ" alt="codecov">
  </a>
  <a href="https://bundlephobia.com/result?p=fluent-vue">
    <img src="https://img.shields.io/bundlephobia/min/fluent-vue" alt="npm bundle size">
  </a>
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide">
  </a>
  <a href="https://github.com/Demivan/fluent-vue/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/demivan/fluent-vue" alt="GitHub license">
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

## 📜 Changelog

Changes for each release are documented in the [CHANGELOG.md](https://github.com/demivan/fluent-vue/blob/main/CHANGELOG.md).

## 📦 Packages

| Project | NPM | Repo |
| ------- | --- | ---- |
| fluent-vue | [![fluent-vue](https://img.shields.io/npm/v/fluent-vue.svg)](https://www.npmjs.com/package/fluent-vue) | [demivan/fluent-vue](https://github.com/Demivan/fluent-vue)
| Webpack loader | [![fluent-vue-loader](https://img.shields.io/npm/v/fluent-vue-loader.svg)](https://www.npmjs.com/package/fluent-vue-loader) | [fluent-vue/fluent-vue-loader](https://github.com/fluent-vue/fluent-vue-loader)
| Rollup/Vite plugin | [![frollup-plugin-fluent-vue](https://img.shields.io/npm/v/rollup-plugin-fluent-vue.svg)](https://www.npmjs.com/package/rollup-plugin-fluent-vue) | [fluent-vue/rollup-plugin-fluent-vue](https://github.com/fluent-vue/rollup-plugin-fluent-vue)

## 📄 License

[MIT License](https://github.com/demivan/fluent-vue/blob/main/LICENSE) © 2020-present [Ivan Demchuk](https://github.com/demivan)
