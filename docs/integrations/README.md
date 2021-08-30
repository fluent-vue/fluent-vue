---
title: Tooling and integrations
description: List of official and third-party tools that support fluent-vue
---

# Tooling and integrations

This is the list of official and third-party tools that support fluent-vue.

## Official 

### 1. Webpack loader

[fluent-vue-loader](/integrations/webpack.html) is the officially provided Webpack loader.

With `fluent-vue-loader`, you can use `fluent` custom blocks to define locale messages directly in Vue SFC files.

### 2. Rollup and Vite plugin

Both [Rollup](/integrations/rollup.html) and [Vite](/integrations/vite.html) integrations are provided by `rollup-plugin-fluent-vue` plugin.

It provides the same functionality as Webpack loader - use custom blocks in SFC files.

### 3. WIP: CLI tool

`fluent-vue-cli` is the official tool that (soon™) allows extracting and importing SFC locale messages to and from FTL files. This allows integration with external translation tools like Mozilla's [Pontoon](https://github.com/mozilla/pontoon/)  

## Third-party

### 1. i18n Ally

[i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) - :earth_africa: All in one i18n extension for VS Code.

It reports missing translations, allows to extract hardcoded strings, and much more.

Check their [README](https://github.com/lokalise/i18n-ally) for more information.

![i18n Ally](../assets/i18n-ally.png)
