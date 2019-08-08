import { DirectiveBinding } from 'vue/types/options'
import { VNode } from 'vue/types/vnode'
import { warn } from './util/warn'

export default {
  bind(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (vnode.context === undefined) {
      return
    }

    if (binding.arg === undefined) {
      warn(false, 'v-t directive is missing arg with translation key')
      return
    }

    const msg = vnode.context.$fluent.getMessage(binding.arg)

    if (msg === undefined) {
      return
    }

    el.textContent = vnode.context.$fluent.formatPattern(msg.value, binding.value)
    if (vnode.data === undefined || vnode.data.attrs === undefined) {
      return
    }

    for (const [attr] of Object.entries(binding.modifiers)) {
      el.setAttribute(
        attr,
        vnode.context.$fluent.formatPattern(msg.attributes[attr], binding.value)
      )
    }
  }
}
