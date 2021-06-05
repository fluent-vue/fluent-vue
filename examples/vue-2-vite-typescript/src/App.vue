<template>
  <div>
    <h3>Examples</h3>

    <h4>$t method</h4>
    <div>
      <span>{{ $t('greeting', { name: 'World' }) }}</span>
    </div>

    <h4>$ta method</h4>
    <div>
      <span v-bind="$ta('greeting')">{{ $t('greeting', { name: 'World' }) }}</span>
    </div>

    <h4>Directive</h4>
    <div>
      <span v-t:greeting="{ name: 'World' }"></span>
    </div>

    <h4>Component</h4>
    <div>
      <i18n path="greeting" tag="div">
        <template #name>
          <b>{{ $t('user-name') }}</b>
        </template>
      </i18n>
    </div>

    <h4>Composition api (useFluent)</h4>
    <div v-bind="compositionGreeting">
      {{ compositionGreeting }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { useFluent } from 'fluent-vue'

export default Vue.extend({
  name: 'typescript',
  setup () {
    const { $t, $ta } = useFluent()

    return {
      compositionUsername: $t('user-name', { name: $t('user-name') }),
      compositionGreeting: $ta('greeting')
    }
  },
  computed: {
    username (): string {
      return this.$t('user-name')
    },
    greeting (): string {
      return this.$ta('greeting')
    },
  },
})
</script>

<fluent locale="en">
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
</fluent>

<style>
.test {
  display: block;
}
</style>
