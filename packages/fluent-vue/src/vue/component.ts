import { defineComponent, h, getCurrentInstance, inject, computed } from 'vue-demi'
import { camelize } from '../util/camelize'
import { getContext } from '../composition'
import { RootContextSymbol } from '../symbols'

function getParentWithFluent(instance: any | null): any {
  const parent = instance?.$parent ?? instance?.parent?.proxy
  const target = parent?.$options ?? parent?.type

  if (target != null && target.fluent == null) {
    return getParentWithFluent(parent)
  }

  return parent
}

export default defineComponent({
  name: 'i18n',
  props: {
    path: { type: String, required: true },
    tag: { type: String, default: 'span' },
    args: { type: Object, default: () => ({}) },
    useTa: { type: Boolean, default: false },
  },
  setup(props, context) {
    const childSlots = context.slots

    const rootContext = inject(RootContextSymbol)!
    const instance = getCurrentInstance()
    const parent = getParentWithFluent(instance)
    const fluent = getContext(rootContext, parent)

    const fluentParams = computed(() =>
      Object.assign(
        {},
        props.args,
        ...Object.keys(childSlots).map((key) => ({
          [key]: `\uFFFF\uFFFE${key}\uFFFF`,
        }))
      )
    )

    const translation = computed(() => {
      return fluent.format(props.path, fluentParams.value)
    })

    const translationAttrs = computed(() => {
      if (!props.useTa) {
        return null
      }

      const attrs = fluent.formatAttrs(props.path, fluentParams.value)

      const camelizedAttrs: Record<string, string> = {}
      for (const attr in attrs) {
        camelizedAttrs[camelize(attr)] = attrs[attr]
      }
      return camelizedAttrs
    })

    return () =>
      h(
        props.tag,
        {
          ...context,
        },
        translation.value
          .split('\uFFFF')
          .map((text) =>
            text.startsWith('\uFFFE')
              ? childSlots[text.replace('\uFFFE', '')]?.(translationAttrs.value)
              : text
          ) as any
      )
  },
})
