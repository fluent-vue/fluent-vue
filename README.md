# ![fluent-vue logo](https://raw.githubusercontent.com/demivan/fluent-vue/HEAD/docs/assets/logo.svg)

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/demivan/fluent-vue/Test)](https://github.com/Demivan/fluent-vue/actions)
[![codecov](https://codecov.io/gh/Demivan/fluent-vue/branch/develop/graph/badge.svg?token=0JSSE94EGJ)](https://codecov.io/gh/Demivan/fluent-vue)
[![npm bundle size](https://img.shields.io/bundlephobia/min/fluent-vue)](https://bundlephobia.com/result?p=fluent-vue)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![GitHub license](https://img.shields.io/github/license/demivan/fluent-vue)](https://github.com/Demivan/fluent-vue/blob/develop/LICENSE)

Internationalization plugin for Vue.js

`fluent-vue` is [Vue.js](https://vuejs.org) integration for [Fluent.js](https://github.com/projectfluent/fluent.js) - JavaScript implementation of [Project Fluent](https://projectfluent.org)

## 🚀 Features

- **Simple api for developers**: Just 2 methods, 1 directive and 1 component
- **Powerfull syntax for translators**: Use the entire expressive power of every language without need for changes to application source code
- **Isolation**: Locale-specific logic doesn't leak to other locales. A simple string in English can map to a complex multi-variant translation in another language
- **Seamless migration**: Works for **both** Vue 3 and 2
- **No bundler required**: Usable via CDN

## 📖 Documentation

Documentation can be found here: [https://fluent-vue.demivan.me](https://fluent-vue.demivan.me)

Examples for different Vue.js versions and build systems can be found [here](https://github.com/demivan/fluent-vue/tree/develop/examples).

## 📜 Changelog

Changes for each release are documented in the [CHANGELOG.md](https://github.com/demivan/fluent-vue/blob/develop/CHANGELOG.md).

## 📦 Packages

This monorepo contains multiple packages:

* [fluent-vue](https://github.com/Demivan/fluent-vue/tree/develop/packages/fluent-vue) - Vue.js plugin
* [fluent-vue-loader](https://github.com/Demivan/fluent-vue/tree/develop/packages/fluent-vue-loader) - Webpack loader that adds support for custom blocks in SFC
* [rollup-plugin-fluent-vue](https://github.com/Demivan/fluent-vue/tree/develop/packages/rollup-plugin-fluent-vue) - Rollup\Vite plugin that adds support for custom blocks in SFC

## 📄 License

[MIT License](https://github.com/demivan/fluent-vue/blob/develop/LICENSE) © 2020-present [Ivan Demchuk](https://github.com/demivan)
