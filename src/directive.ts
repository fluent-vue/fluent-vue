import { DirectiveBinding } from 'vue/types/options'
import { VNode } from 'vue/types/vnode'

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

    const directiveData = binding.value as FluentDirectiveBinding

    el.textContent = vnode.context.$t(directiveData.key, directiveData.arg)
  }
}
