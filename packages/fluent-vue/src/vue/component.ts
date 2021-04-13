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
      return fluent.formatWithAttrs(props.path, fluentParams.value)
    })

    const camelizedAttrs = computed(() =>
      Object.fromEntries(
        Object.entries(translation.value.attributes).map(([key, value]) => [camelize(key), value])
      )
    )

    return () =>
      h(
        props.tag,
        {
          ...context,
        },
        translation.value.value
          .split('\uFFFF')
          .map((text) =>
            text.startsWith('\uFFFE')
              ? childSlots[text.replace('\uFFFE', '')]?.(camelizedAttrs.value)
              : text
          ) as any
      )
  },
})
