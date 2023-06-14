import { type PropType, computed, defineComponent, getCurrentInstance, h, inject } from 'vue-demi'
import type { ResolvedOptions, SimpleNode } from 'src/types'
import type { VueComponent } from 'src/types/typesCompat'

import { camelize } from '../util/camelize'
import { getContext } from '../getContext'
import { RootContextSymbol } from '../symbols'
import { assert, warn } from '../util/warn'

function getParentWithFluent(
  instance: VueComponent | null | undefined,
): VueComponent | null | undefined {
  const parent = instance?.$parent
  const target = parent?.$options

  if (target != null && target.fluent == null)
    return getParentWithFluent(parent)

  return parent
}

// Match the opening angle bracket (<) in HTML tags, and HTML entities like
// &amp;, &#0038;, &#x0026;.
const reMarkup = /<|&#?\w+;/

export function createComponent(options: ResolvedOptions) {
  return defineComponent({
    name: options.componentName,
    props: {
      path: { type: String, required: true },
      tag: { type: [String, Boolean] as PropType<string | false>, default: options.tag },
      args: { type: Object, default: () => ({}) },
      html: { type: Boolean, default: false },
    },
    setup(props, { slots, attrs }) {
      const rootContext = inject(RootContextSymbol)
      assert(rootContext != null, 'i18n component used without installing plugin')
      const instance = getCurrentInstance()
      const parent = getParentWithFluent(instance?.proxy)
      const fluent = getContext(rootContext, parent)

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
            Array.from(el.childNodes).map(node => processNode(node)))
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

      return () => props.tag === false ? children.value : h(props.tag, { ...attrs }, children.value)
    },
  })
}
