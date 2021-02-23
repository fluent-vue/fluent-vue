import vue from '@vitejs/plugin-vue'
import { parse as parseUrl } from 'url'

const fluentPlugin = {
  name: 'fluent-vue',
  transform(code, id) {
    if (!/vue&type=i18n/.test(id)) {
      return
    }

    const request = parseUrl(id)
    const query = new URLSearchParams(request.search)

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
