<script setup lang="ts">
import { useFluent } from 'fluent-vue'

const { $t } = useFluent()

const compositionGreeting = computed(() => $t('greeting', { name: $t('user-name') }))
</script>

<template>
  <div>
    <button @click="$changeLocale('en')">
      English
    </button>
    <button @click="$changeLocale('fr')">
      French
    </button>

    <h3>$t method</h3>
    <span>{{ $t('greeting', { name: 'World' }) }}</span>

    <h3>Directive</h3>
    <span v-t:greeting="{ name: 'World' }" />

    <h3>Composition API (useFluent)</h3>
    <div>{{ compositionGreeting }}</div>
  </div>
</template>
