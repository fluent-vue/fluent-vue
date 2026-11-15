<template>
  <h3>$t method</h3>
  <span>{{ $t('greeting', { name: 'World' }) }}</span>

  <h3>Directive</h3>
  <span v-t:greeting="{ name: 'World' }" />

  <h3>Component</h3>
  <i18n path="greeting" tag="div">
    <template #name>
      <b>{{ $t('user-name') }}</b>
    </template>
  </i18n>
</template>

<fluent locale="en">
user-name = World
greeting = Hello, {$name}
  .aria-label = Label value
</fluent>
