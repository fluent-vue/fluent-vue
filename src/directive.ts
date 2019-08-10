import { DirectiveBinding } from 'vue/types/options'
import { VNode } from 'vue/types/vnode'
import { warn } from './util/warn'
import { FluentVueObject } from '../types'

function translate(el: HTMLElement, fluent: FluentVueObject, binding: DirectiveBinding) {
  if (binding.arg === undefined) {
    warn(false, 'v-t directive is missing arg with translation key')
    return
  }

  const msg = fluent.getMessage(binding.arg)

  if (msg === undefined) {
    return
  }

  el.textContent = fluent.formatPattern(msg.value, binding.value)

  for (const [attr] of Object.entries(binding.modifiers)) {
    el.setAttribute(attr, fluent.formatPattern(msg.attributes[attr], binding.value))
  }
}

export default {
  bind(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (vnode.context === undefined) {
      return
    }

    translate(el, vnode.context.$fluent, binding)
  },

  update(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (vnode.context === undefined) {
      return
    }

    translate(el, vnode.context.$fluent, binding)
  }
}
