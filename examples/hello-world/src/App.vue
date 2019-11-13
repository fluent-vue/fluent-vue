<template>
  <div>
    <h3>Examples</h3>

    <h4>Method</h4>
    <div>
      <span>
        {{ $t('greeting', { name: 'John' }) }}
      </span>
    </div>

    <h4>Directive</h4>
    <div>
      <span v-t:greeting="{ name: 'John' }"></span>
    </div>

    <h4>Component</h4>
    <div>
      <i18n path="greeting">
        <template #name>
          <b>{{ $t('user-name') }}</b>
        </template>
      </i18n>
    </div>
  </div>
</template>

<script>
export default {

}
</script>
