import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'
import { createApp } from 'vue'

import App from './App.vue'

const fluent = createFluentVue({
  bundles: [
    new FluentBundle('en'),
  ],
})

createApp(App).use(fluent).mount('#app')
