import type { VueComponent } from '../types/typesCompat'

import { defineComponent, h, getCurrentInstance, inject, computed } from 'vue-demi'
import { camelize } from '../util/camelize'
import { getContext } from '../composition'
import { RootContextSymbol } from '../symbols'
import { assert } from '../util/warn'

function getParentWithFluent(
  instance: VueComponent | null | undefined
): VueComponent | null | undefined {
  const parent = instance?.$parent
  const target = parent?.$options

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
  setup(props, { slots, attrs }) {
    const rootContext = inject(RootContextSymbol)
    assert(rootContext != null, 'i18n component used without instaling plugin')
    const instance = getCurrentInstance()
    const parent = getParentWithFluent(instance?.proxy)
    const fluent = getContext(rootContext, parent)

    const fluentParams = computed(() =>
      Object.assign(
        {},
        props.args,
        ...Object.keys(slots).map((key) => ({
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
          ...attrs,
        },
        translation.value.value
          .split('\uFFFF')
          .map((text) =>
            text.startsWith('\uFFFE')
              ? slots[text.replace('\uFFFE', '')]?.(camelizedAttrs.value)
              : text
          )
      )
  },
})
