import { Vue } from 'vue/types/vue'
import extend from './extend'
import mixin from './mixin'
import directive from './vue/directive'
import component from './vue/component'

export default function install(vue: typeof Vue) {
  extend(vue)
  vue.mixin(mixin)
  vue.directive('t', directive)
  vue.component('i18n', component as any)
}
