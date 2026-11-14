---
"fluent-vue": patch
---

Stop `mapVariable` from mutating the variables object passed to `format`, `$t`, `$ta` and `v-t`. Readonly, reactive and frozen objects (such as component `props`) now format correctly, and attributes are formatted from the original values instead of already-mapped ones.
