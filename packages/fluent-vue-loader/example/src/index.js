import Vue from 'vue'
import FluentVue from '../../../fluent-vue'
import App from './App.vue'

const fluent = new FluentVue({
  locale: 'en',
  bundles: [],
})

Vue.use(FluentVue)

const app = new Vue({
  fluent,
  render(h) {
    return h(App)
  },
})

app.$mount('#app')
