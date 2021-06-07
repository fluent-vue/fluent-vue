import Vue from 'vue'
import CompositionApi from '@vue/composition-api'
import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

import App from './App.vue'

// Only needed if you want to use composition api
Vue.use(CompositionApi)

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
