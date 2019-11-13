import Vue from 'vue';
import { FluentBundle, FluentResource } from '@fluent/bundle';
import FluentVue from 'fluent-vue';

import App from './App';

Vue.use(FluentVue)

const bundle = new FluentBundle({
  locales: 'en'
})

bundle.addResource(new FluentResource('user-name = World'))
bundle.addResource(new FluentResource('greeting = Hello, {$name}'))

const fluent = new FluentVue({
  bundles: [bundle]
})

new Vue({
  el: "#root",
  fluent,
  render: h => h(App)
})
