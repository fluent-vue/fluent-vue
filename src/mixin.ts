import FluentVue from './fluent-vue'
import Vue, { ComponentOptions, VueConstructor } from 'vue'

export default {
  beforeCreate(): void {
    const options: any = this.$options

    // TODO: Per component config
    if (options.fluent) {
      this._fluent = options.fluent
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

  beforeDestroy(): void {
    if (!this._fluent) {
      return
    }

    const self = this
    this.$nextTick(() => {
      self._fluent = undefined
    })
  }
} as any
