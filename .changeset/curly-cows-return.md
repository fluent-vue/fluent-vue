---
"fluent-vue": major
---

Drop CJS and production builds. There should be no difference for most consumers.

CJS consumers (SSR via require, Jest in CJS mode) need Node 20.19+/22.12+ or ESM-aware tooling.
