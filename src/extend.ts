import { Vue, VueConstructor } from 'vue/types/vue'

/**
 * Extend Vue prototype with new methods
 */
export default function extend(Vue: VueConstructor<Vue>): void {
  Object.defineProperty(Vue.prototype, '$fluent', {
    get() {
      return this._fluent
    }
  })

  Vue.prototype.$t = function(key: string, values: any): string {
    return this.$fluent.format(key, values)
  }
}
