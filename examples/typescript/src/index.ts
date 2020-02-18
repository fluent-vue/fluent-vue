import Vue from 'vue';
import { FluentBundle, FluentResource } from '@fluent/bundle';
import ftl from '@fluent/dedent';
import FluentVue from 'fluent-vue';

import App from './App.vue';

Vue.use(FluentVue)

const bundle = new FluentBundle('en')

bundle.addResource(new FluentResource('user-name = World'))
bundle.addResource(new FluentResource('aria-key = Aria value'))
bundle.addResource(new FluentResource(
  ftl`
  greeting = Hello, {$name}
    .aria-label = Label value
  `))

const fluent = new FluentVue({
  bundles: [bundle]
})

new Vue({
  el: "#root",
  fluent,
  render: h => h(App)
})
