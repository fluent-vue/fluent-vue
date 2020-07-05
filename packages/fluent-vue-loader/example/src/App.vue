<template>
  <form>
    <label>{{ $t('language') }}</label>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="ja">ja</option>
    </select>

    <p>{{ $t('hello') }}</p>
  </form>
</template>

<script>
export default {
name: 'App',
data () {
return {
locale: 'en'
}
},
  created () {
    console.log(this)
  }
}
</script>

<i18n locale="en">
  language = English
  hello = Hello
</i18n>

<i18n locale="uk">
  language = Ukraininan
  hello = Hello
</i18n>
