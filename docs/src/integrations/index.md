---
title: Tooling and integrations
description: List of official and third-party tools that support fluent-vue
---

# Tooling and integrations

This is the list of official and third-party tools that support `fluent-vue`.

## Official

### 1. unplugin-fluent-vue

[unplugin-fluent-vue](/integrations/unplugin) is a plugin for Vite, Webpack and Rollup. It adds support for defining translation messages in Vue SFCs and external ftl files.

### 2. Webpack loader

**Deprecated. Use `unplugin-fluent-vue` instead.**

[fluent-vue-loader](/integrations/webpack) is the officially provided Webpack loader.

With `fluent-vue-loader`, you can use `fluent` custom blocks to define locale messages directly in Vue SFC files.

### 3. Rollup and Vite plugin

**Deprecated. Use `unplugin-fluent-vue` instead.**

Both [Rollup](/integrations/rollup) and [Vite](/integrations/vite) integrations are provided by `rollup-plugin-fluent-vue` plugin.

It provides the same functionality as Webpack loader - use custom blocks in SFC files.

## Third-party

### 1. i18n Ally

[i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) - :earth_africa: All in one i18n extension for VS Code.

It reports missing translations, allows to extract hardcoded strings, and much more.

Check their [README](https://github.com/lokalise/i18n-ally) for more information.

![i18n Ally](../public/assets/i18n-ally.png)
