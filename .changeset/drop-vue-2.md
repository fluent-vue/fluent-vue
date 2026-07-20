---
"fluent-vue": major
---

Drop Vue 2 support. `fluent-vue` is now Vue 3 only and no longer depends on `vue-demi` or `@vue/composition-api`.

Vue 2 reached end-of-life at the end of 2023. Most project have long migrated to Vue 3. Dropping Vue 2 also clears the way for Vue 3.6 support, which is coming in `fluent-vue` v4.

There is no `fluent-vue` API change in this release: apart from removing Vue 2, everything works the same. Which version to use:

- **Vue 2** → stay on `fluent-vue` v3.
- **Vue 3 (including 3.6)** → upgrade to `fluent-vue` v4.

**Breaking changes:**

- Vue 2 is no longer supported. The minimum supported version is Vue 3.2.
- Removed the `vue-demi` dependency and the optional `@vue/composition-api` peer dependency.
