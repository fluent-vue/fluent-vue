import type { ResolvedOptions, SimpleNode } from 'src/types'

import type { PropType } from 'vue-demi'
import type { TranslationContext } from '../TranslationContext'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  isVue2,
} from 'vue-demi'
import { getContext } from '../getContext'
import { camelize } from '../util/camelize'
import { warn } from '../util/warn'

// Match the opening angle bracket (<) in HTML tags, and HTML entities like
// &amp;, &#0038;, &#x0026;.
const reMarkup = /<|&#?\w+;/

export function createComponent(options: ResolvedOptions, rootContext: TranslationContext) {
  return defineComponent({
    name: options.componentName,
    props: {
      path: { type: String, required: true },
      tag: { type: [String, Boolean] as PropType<string | false>, default: options.componentTag },
      args: { type: Object, default: () => ({}) },
      html: { type: Boolean, default: false },
      noTag: { type: Boolean, default: false },
    },
    setup(props, { slots, attrs }) {
      const instance = getCurrentInstance()

      const fluent = getContext(
        rootContext,
        // @ts-expect-error This is internal Vue feature added in https://github.com/vuejs/core/commit/11214eedd2699e15106c44927f4d1206b111fbd3
        instance?.vnode?.ctx /* Vue 3 */ ?? instance?.proxy?.$vnode?.context /* Vue 2 */,
      )

      const translation = computed(() => {
        const fluentParams = Object.assign(
          {},
          props.args,
          // Create fake translation parameters for each slot.
          // Later, we'll replace the parameters with the actual slot
          ...Object.keys(slots).map(key => ({
            [key]: `\uFFFF\uFFFE${key}\uFFFF`,
          })),
        )

        const result = fluent.formatWithAttrs(props.path, fluentParams)

        const camelizedAttrs = Object.fromEntries(
          Object.entries(result.attributes).map(([key, value]) => [camelize(key), value]),
        )

        return {
          value: result.value,
          attributes: camelizedAttrs,
        }
      })

      const insertSlots = (text: string | null) => {
        return text?.split('\uFFFF')
          .map(text =>
            text.startsWith('\uFFFE')
              ? slots[text.replace('\uFFFE', '')]!(translation.value.attributes)
              : text,
          )
      }

      // No way to type this properly, so we'll just use `any` for now.
      const processNode = (node: SimpleNode): any => {
        if (node.nodeType === 3) { // Node.TEXT_NODE
          return insertSlots(node.nodeValue)
        }
        else if (node.nodeType === 1) { // Node.ELEMENT_NODE
          const el = node as Element

          return h(
            el.nodeName.toLowerCase(),
            {
              ...Object.fromEntries(
                Array.from(el.attributes).map(attr => [attr.name, attr.value]),
              ),
            },
            Array.from(el.childNodes).map(node => processNode(node)),
          )
        }

        // Ignore other node types for now.
        warn(`Unsupported node type: ${(node as any).nodeType}. If you need support for it, please, create an issue in fluent-vue repository.`)
        return []
      }

      const children = computed(() => {
        // If the message value doesn't contain any markup nor any HTML entities, return it as-is.
        if (!props.html || !reMarkup.test(translation.value.value))
          return insertSlots(translation.value.value)

        // Otherwise, parse the message value as HTML and convert it to an array of VNodes.
        const nodes = fluent.options.parseMarkup(translation.value.value)
        return nodes.map(processNode)
      })

      if (isVue2 && (props.tag === false || props.noTag))
        warn('Vue 2 requires a root element when rendering components. Please, use `tag` prop to specify the root element.')

      return () => props.tag === false || props.noTag ? children.value : h(props.tag, { ...attrs }, children.value)
    },
  })
}
