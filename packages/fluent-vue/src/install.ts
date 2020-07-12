import Vue from 'vue'

import extend from './extend'
import { createMixin } from './mixin'
import directive from './vue/directive'
import component from './vue/component'
import { FluentVue } from './interfaces'
import { TranslationContext } from './fluentVue'

export default function install(
  vue: typeof Vue,
  fluentVue: FluentVue,
  rootContext: TranslationContext
) {
  extend(vue)
  vue.mixin(createMixin(fluentVue, rootContext))
  vue.directive('t', directive)
  vue.component('i18n', component)
}
