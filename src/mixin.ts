import FluentVue from './fluent-vue'
import { Vue } from 'vue/types/vue'

export default {
  beforeCreate(this: Vue): void {
    const options: any = this.$options

    if (options.fluent) {
      if (options.fluent instanceof FluentVue) {
        this._fluent = options.fluent
      } else {
        // TODO: Per component config
      }
    } else if (this.$root && this.$root.$fluent && this.$root.$fluent instanceof FluentVue) {
      // root i18n
      this._fluent = this.$root.$fluent
    } else if (
      options.parent &&
      options.parent.$fluent &&
      options.parent.$fluent instanceof FluentVue
    ) {
      // parent i18n
      this._fluent = options.parent.$fluent
    }
  },

  beforeDestroy(this: Vue): void {
    if (!this._fluent) {
      return
    }

    const self = this
    this.$nextTick(() => {
      self._fluent = undefined
    })
  }
}
