import type { TranslationContext } from '../TranslationContext'
import type { Vue2Directive, Vue3Directive, VueDirectiveBinding } from '../types/typesCompat'
import { watchEffect } from 'vue-demi'

import { getContext } from '../getContext'
import { warn } from '../util/warn'
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
    else
      warn(`Attribute '${attr}' on element <${el.tagName.toLowerCase()}> is not localizable. Remove it from the translation. Translation key: ${key}`)
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

    getSSRProps(binding) {
      const context = getContext(rootContext, binding.instance)
      if (binding.arg === void 0) {
        warn('v-t directive is missing arg with translation key')
        return {}
      }

      const translation = context.formatWithAttrs(binding.arg, binding.value)

      // Vue 3 does not expose the element in the binding object during SSR.
      // So we can't check if the attribute is allowed.
      // We assume that all attributes are allowed.
      // This could lead to SSR hydration mismatches if translation
      // contains attributes that are not allowed.
      // There is a runtime warning in the browser console in case translation
      // contains not allowed attributes, this should catch this case.
      const attrs = translation.attributes

      if (translation.hasValue) {
        attrs.textContent = translation.value
      }

      return attrs
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
