import { createApp } from 'vue'
import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

import App from './App.vue'

const bundle = new FluentBundle('en')

const fluent = createFluentVue({
  bundles: [bundle]
})

createApp(App).use(fluent).mount('#root')
