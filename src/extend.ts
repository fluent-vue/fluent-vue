export default function extend(Vue: any): void {
  Object.defineProperty(Vue.prototype, '$fluent', {
    get() {
      return this._fluent
    }
  })

  Vue.prototype.$t = function(key: string, values: any): string {
    return this.$fluent.format(key, values)
  }
}
