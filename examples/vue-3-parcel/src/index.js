import { createApp } from 'vue'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import ftl from '@fluent/dedent'
import { createFluentVue } from 'fluent-vue'

import App from './App'

const bundle = new FluentBundle('en')

bundle.addResource(new FluentResource('user-name = World'))
bundle.addResource(new FluentResource('aria-key = Aria value'))
bundle.addResource(
  new FluentResource(ftl`
  greeting = Hello, {$name}
    .aria-label = Label value
  `)
)

const fluent = createFluentVue({
  bundles: [bundle]
})

createApp(App).use(fluent).mount('#root')
