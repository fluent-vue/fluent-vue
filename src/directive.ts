import { DirectiveBinding } from 'vue/types/options'
import { VNode } from 'vue/types/vnode'
import { warn } from './util/warn'
import { FluentVueObject } from '../types'

function translate(el: HTMLElement, fluent: FluentVueObject, binding: DirectiveBinding) {
  const key = binding.arg

  if (key === undefined) {
    warn('v-t directive is missing arg with translation key')
    return
  }

  const bundle = fluent.getBundle(key)
  const msg = fluent.getMessage(bundle, key)

  if (bundle === null || msg === null) {
    return
  }

  if (msg.value !== null) {
    el.textContent = fluent.formatPattern(bundle, msg.value, binding.value)
  }

  for (const [attr] of Object.entries(binding.modifiers)) {
    el.setAttribute(attr, fluent.formatPattern(bundle, msg.attributes[attr], binding.value))
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
