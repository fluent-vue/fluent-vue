import { Vue } from 'vue/types/vue'
import extend from './extend'
import mixin from './mixin'
import directive from './directive'

export default function install(vue: typeof Vue) {
  extend(vue)
  vue.mixin(mixin)
  vue.directive('t', directive)
}
