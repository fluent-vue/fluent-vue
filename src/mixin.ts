import { Vue } from 'vue/types/vue'
import FluentVue from './fluent-vue'

export default {
  beforeCreate(this: Vue): void {
    const options = this.$options

    if (options.fluent && options.fluent instanceof FluentVue) {
      this._fluent = options.fluent
    } else if (
      options.parent &&
      options.parent.$fluent &&
      options.parent.$fluent instanceof FluentVue
    ) {
      this._fluent = options.parent.$fluent
    }

    if (!this._fluent) {
      return
    }

    this._fluent.subscribe(this)
  },

  beforeDestroy(this: Vue): void {
    if (!this._fluent) {
      return
    }

    this._fluent.unsubscribe(this)

    this.$nextTick(() => {
      this._fluent = undefined
    })
  }
}
