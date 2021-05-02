# Vite

Vite plugin is planned, but for now it is easy to add support for custom blocks using custom plugin:

```js
import vue from '@vitejs/plugin-vue'

const fluentPlugin = {
  name: 'fluent-vue',
  transform(code, id) {
    if (!/vue&type=fluent/.test(id)) {
      return
    }

    const [filename, rawQuery] = id.split('?', 2)
    const query = new URLSearchParams(rawQuery)

    return `
import { FluentResource } from '@fluent/bundle'

export default function (Component) {
  Component.fluent = Component.fluent || {}
  Component.fluent['${query.get('locale')}'] = new FluentResource(\`${code}\`)
}`
  },
}

export default {
  optimizeDeps: {
    link: ['fluent-vue'],
  },
  plugins: [vue(), fluentPlugin],
}
```
