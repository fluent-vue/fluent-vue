import { watchEffect } from 'vue-demi'
import type { Vue2Directive, Vue3Directive, VueDirectiveBinding } from '../types/typesCompat'
import type { TranslationContext } from '../TranslationContext'

import { warn } from '../util/warn'
import { getContext } from '../getContext'
import { isAttrNameLocalizable } from './dom'

function translate(el: HTMLElement, fluent: TranslationContext, binding: VueDirectiveBinding): void {
  const key = binding.arg

  if (key === undefined) {
    warn('v-t directive is missing arg with translation key')
    return
  }

  const translation = fluent.formatWithAttrs(key, binding.value)

  if (translation.hasValue)
    el.textContent = translation.value

  const allowedAttrs = Object.keys(binding.modifiers)
  for (const [attr, attrValue] of Object.entries(translation.attributes)) {
    if (isAttrNameLocalizable(attr, el, allowedAttrs))
      el.setAttribute(attr, attrValue)
  }
}

export function createVue3Directive(rootContext: TranslationContext): Vue3Directive {
  return {
    mounted(el, binding) {
      watchEffect(() => {
        const context = getContext(rootContext, binding.instance)
        translate(el, context, binding)
      })
    },

    updated(el, binding) {
      const context = getContext(rootContext, binding.instance)
      translate(el, context, binding)
    },
  }
}

export function createVue2Directive(rootContext: TranslationContext): Vue2Directive {
  return {
    bind(el, binding, vnode) {
      const context = getContext(rootContext, vnode.context)
      translate(el, context, binding)
    },

    update(el, binding, vnode) {
      const context = getContext(rootContext, vnode.context)
      translate(el, context, binding)
    },
  }
}
