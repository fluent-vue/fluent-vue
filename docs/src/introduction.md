# Introduction

`fluent-vue` is an internationalization plugin for [Vue.js](https://vuejs.org). It's a Vue.js integration for [Fluent.js](https://github.com/projectfluent/fluent.js) - JavaScript implementation of Mozilla's [Project Fluent](https://projectfluent.org).

Fluent keeps simple things simple and makes complex things possible. The syntax used for describing translations is easy to read and understand. At the same time, it allows, when necessary, to represent complex concepts from natural languages like gender, plurals, conjugations, and others. Check the [Fluent syntax](/fluent-syntax) page or the official [Fluent Syntax Guide](https://www.projectfluent.org/fluent/guide/) to learn more about the syntax.

`fluent-vue` API is inspired by [vue-i18n](https://kazupon.github.io/vue-i18n). But API surface is much smaller as most things are handled by Fluent syntax. It has just two methods, one component and one directive.

## Example

<<< @/components/Simple.vue#snippet

<script setup>
  import SimpleInput from './components/SimpleInput.vue'
</script>


::: info Example
<simple-input />
:::
