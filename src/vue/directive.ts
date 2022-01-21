import { watchEffect } from 'vue-demi'
import type { Vue2Directive, Vue3Directive, VueDirectiveBinding } from '../types/typesCompat'
import type { TranslationContext } from '../TranslationContext'

import { warn } from '../util/warn'
import { getContext } from '../getContext'

// Copied from fluent-dom library
const LOCALIZABLE_ATTRIBUTES: Record<string, string[]> = {
  global: ['title', 'aria-label', 'aria-valuetext', 'aria-moz-hint'],
  a: ['download'],
  area: ['download', 'alt'],
  // value is special-cased in isAttrNameLocalizable
  input: ['alt', 'placeholder'],
  menuitem: ['label'],
  menu: ['label'],
  optgroup: ['label'],
  option: ['label'],
  track: ['label'],
  img: ['alt'],
  textarea: ['placeholder'],
  th: ['abbr'],
}

/**
 * Check if attribute is allowed for the given element.
 *
 * This method is used by the sanitizer when the translation markup contains
 * DOM attributes, or when the translation has traits which map to DOM
 * attributes.
 *
 * `explicitlyAllowed` can be passed as a list of attributes explicitly
 * allowed on this element.
 *
 * @private
 */
function isAttrNameLocalizable(
  name: string,
  element: HTMLElement,
  explicitlyAllowed: string[],
): boolean {
  if (explicitlyAllowed.includes(name))
    return true

  if (element.namespaceURI === null)
    return false

  const attrName = name.toLowerCase()
  const elemName = element.localName

  // Is it a globally safe attribute?
  if (LOCALIZABLE_ATTRIBUTES.global.includes(attrName))
    return true

  // Are there no allowed attributes for this element?
  if (LOCALIZABLE_ATTRIBUTES[elemName] == null)
    return false

  // Is it allowed on this element?
  if (LOCALIZABLE_ATTRIBUTES[elemName].includes(attrName))
    return true

  // Special case for value on HTML inputs with type button, reset, submit
  if (
    element.namespaceURI === 'http://www.w3.org/1999/xhtml'
    && elemName === 'input'
    && attrName === 'value'
  ) {
    const type = (element as HTMLInputElement).type.toLowerCase()
    if (type === 'submit' || type === 'button' || type === 'reset')
      return true
  }

  return false
}

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
