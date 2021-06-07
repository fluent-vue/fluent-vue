import Vue from 'vue'
import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

import App from './App.vue'

const bundle = new FluentBundle('en')

const fluent = createFluentVue({
  locale: 'en',
  bundles: [bundle]
})
Vue.use(fluent)

// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  render: h => h(App)
})
