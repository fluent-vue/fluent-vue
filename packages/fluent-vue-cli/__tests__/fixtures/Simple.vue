<template>
  <div>
    {{ $t('greeting', { name: 'World' }) }}
  </div>
</template>

<script>
export default {
}
</script>

<fluent locale="en">
user-name = World
aria-key = Aria value
greeting = Hello, {$name}
  .aria-label = Label value
</fluent>
