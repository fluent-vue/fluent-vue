import { DirectiveBinding } from 'vue/types/options'
import { VNode } from 'vue/types/vnode'
import { warn } from './util/warn'

interface FluentDirectiveBinding {
  key: string
  arg: Object
  attrs?: [string]
}

export default {
  bind(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (vnode.context === undefined) {
      return
    }

    if (binding.arg === undefined) {
      warn(false, 'v-t directive is missing arg with translation key')
      return
    }

    const directiveData = (binding.value as FluentDirectiveBinding) || {}

    el.textContent = vnode.context.$t(binding.arg, directiveData.arg)
  }
}
