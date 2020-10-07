export default {
  optimizeDeps: {
    link: ['fluent-vue'],
  },
  vueCustomBlockTransforms: {
    i18n({ code, query }) {
      return `
import { FluentResource } from '@fluent/bundle'

export default function (Component) {
  Component.fluent = Component.fluent || {}
  Component.fluent['${query.locale}'] = new FluentResource(\`${code}\`)
}`
    },
  },
}
