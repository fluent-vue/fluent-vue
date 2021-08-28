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

<fluent locale="uk">
user-name = Світ
aria-key = Значення aria
greeting = Привіт, {$name}
  .aria-label = Значення мітки
</fluent>
