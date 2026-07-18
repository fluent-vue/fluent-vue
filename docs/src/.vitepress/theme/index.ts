import DefaultTheme from 'vitepress/theme'

import { FluentBundle, FluentResource } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

import { format } from 'date-fns'

import CodeGroup from './CodeGroup.vue'
import CodeBlock from './CodeBlock.vue'

import './theme.css'

const bundle = new FluentBundle('en', {
  functions: {
    DATEFNS (positionalArgs, namedArgs) {
      const [date, formatString] = positionalArgs as [string, string]
      return format(new Date(date), formatString)
    }
  }
})


bundle.addResource(new FluentResource('today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }'))

const fluent = createFluentVue({
  bundles: [bundle],
})

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.use(fluent)

    app.component('code-group', CodeGroup)
    app.component('code-group-item', CodeBlock)
  }
}
