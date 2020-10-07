import { warn } from '../util/warn'
import { TranslationContext } from '../TranslationContext'
import { getContext } from '../composition'

// This part is from fluent-dom library
const LOCALIZABLE_ATTRIBUTES = {
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
} as Record<string, string[]>

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
 * @param   {string}         name
 * @param   {Element}        element
 * @param   {Array}          explicitlyAllowed
 * @returns {boolean}
 * @private
 */
function isAttrNameLocalizable(
  name: string,
  element: HTMLElement,
  explicitlyAllowed: Array<string> | null = null
): boolean {
  if (explicitlyAllowed && explicitlyAllowed.includes(name)) {
    return true
  }

  if (element.namespaceURI === null) {
    return false
  }

  const attrName = name.toLowerCase()
  const elemName = element.localName

  // Is it a globally safe attribute?
  if (LOCALIZABLE_ATTRIBUTES.global.includes(attrName)) {
    return true
  }

  // Are there no allowed attributes for this element?
  if (!LOCALIZABLE_ATTRIBUTES[elemName]) {
    return false
  }

  // Is it allowed on this element?
  if (LOCALIZABLE_ATTRIBUTES[elemName].includes(attrName)) {
    return true
  }

  // Special case for value on HTML inputs with type button, reset, submit
  if (
    element.namespaceURI === 'http://www.w3.org/1999/xhtml' &&
    elemName === 'input' &&
    attrName === 'value'
  ) {
    const type = (element as HTMLInputElement).type.toLowerCase()
    if (type === 'submit' || type === 'button' || type === 'reset') {
      return true
    }
  }

  return false
}

interface DirectiveBinding {
  arg: string | undefined
  modifiers: Record<string, unknown>
  value: Record<string, any>
}

function translate(el: HTMLElement, fluent: TranslationContext, binding: DirectiveBinding) {
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

  const allowedAttrs = Object.keys(binding.modifiers)
  for (const [attr, attrValue] of Object.entries(msg.attributes)) {
    if (isAttrNameLocalizable(attr, el, allowedAttrs)) {
      el.setAttribute(attr, fluent.formatPattern(bundle, attrValue, binding.value))
    }
  }
}

export function createVue3Directive(rootContext: TranslationContext) {
  return {
    beforeMount(el: any, binding: any, vnode: any) {
      if (binding.instance == null) {
        return
      }

      const context = getContext(rootContext, binding.instance)
      translate(el, context, binding)
    },

    updated(el: any, binding: any, vnode: any) {
      if (binding.instance == null) {
        return
      }

      const context = getContext(rootContext, binding.instance)
      translate(el, context, binding)
    },
  }
}

export function createVue2Directive(rootContext: TranslationContext) {
  return {
    bind(el: any, binding: any, vnode: any) {
      if (vnode.context == null) {
        return
      }

      const context = getContext(rootContext, vnode.context)
      translate(el, context, binding)
    },

    update(el: any, binding: any, vnode: any) {
      if (vnode.context == null) {
        return
      }

      const context = getContext(rootContext, vnode.context)
      translate(el, context, binding)
    },
  }
}
