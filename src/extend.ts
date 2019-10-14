import { Vue, VueConstructor } from 'vue/types/vue'

/**
 * Extend Vue prototype with new methods
 * @param Vue Vue to extend
 */
export default function extend(Vue: VueConstructor<Vue>): void {
  Object.defineProperty(Vue.prototype, '$fluent', {
    get() {
      return this._fluent
    }
  })

  /**
   * Format message
   * @param key Translation key
   * @param values Message parameters
   */
  Vue.prototype.$t = function(key: string, values: any): string {
    return this.$fluent.format(key, values)
  }

  /**
   * Format message attributes
   * @param key Translation key
   * @param values Message parameters
   */
  Vue.prototype.$ta = function(key: string, values: any): string {
    return this.$fluent.formatAttrs(key, values)
  }
}
