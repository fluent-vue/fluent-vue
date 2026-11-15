<script setup lang="ts">
import { useFluent } from 'fluent-vue'
import { computed } from 'vue'

const { $t, $ta } = useFluent()

const compositionGreeting = computed(() => $t('greeting', { name: $t('user-name') }))
const compositionGreetingAttrs = computed(() => $ta('greeting', { name: $t('user-name') }))
</script>

<template>
  <h3>$t method</h3>
  <span>{{ $t('greeting', { name: 'World' }) }}</span>

  <h3>$ta method</h3>
  <span v-bind="$ta('greeting')">{{ $t('greeting', { name: 'World' }) }}</span>

  <h3>Directive</h3>
  <span v-t:greeting="{ name: 'World' }" />

  <h3>Component</h3>
  <i18n path="greeting" tag="div">
    <template #name>
      <b>{{ $t('user-name') }}</b>
    </template>
  </i18n>

  <h3>Composition API (useFluent)</h3>
  <div v-bind="compositionGreetingAttrs">
    {{ compositionGreeting }}
  </div>
</template>

<fluent locale="en">
user-name = World
greeting = Hello, {$name}
  .aria-label = Label value
</fluent>
