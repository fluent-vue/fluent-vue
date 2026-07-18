<script setup>
import { useNow } from '@vueuse/core'

const now = useNow()
</script>

// #region snippet
<template>
  <p class="demo">
    {{ $t('default', { now }) }}<br>
    {{ $t('today', { now }) }}<br>
    {{ $t('now', { now }) }}
  </p>
</template>

<fluent locale="en">
default = Current date: {{ $now }}
today = Today is {{ DATETIME($now, day: "numeric", month: "long", year: "numeric") }}
now = It is {{ DATETIME($now, hour: "numeric", minute: "numeric", second: "numeric") }}
</fluent>
// #endregion snippet
