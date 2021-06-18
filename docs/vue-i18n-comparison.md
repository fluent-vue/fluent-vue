# Comparison with vue-i18n

## Formatting

Simple formatting API in `fluent-vue` is similar to `vue-i18n`.

### fluent-vue

**Template**
```js
$t('hello', { name: 'John' })
```

**Message**
```ftl
hello = Hello {$name}
```

### vue-i18n

**Template**
```js
$t('hello', { name: 'John' })
```

**Message**
```
hello = Hello {name}
```

## Pluralization

`vue-i18n` has separate method `$tc` for pluralization. `fluent-vue` uses same `$t` method as with simple formatting.

So in `fluent-vue` adding pluralization can be done without changing application code just changing localization message.

### fluent-vue

**Template**
```js
$t('apples', { count: 2 })
```

**Message**
```ftl
apples = { $count ->
   [0] no apples
   [one] one apple
  *[other] {$count} apples
}
```

### vue-i18n

**Template**
```js
$tc('apples', 2, { count: 2 })
```

**Message**
```
apples = no apples | one apple | {count} apples
```

## DateTime localization

Both `fluent-vue` and `vue-i18n` use [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for date formatting. With `vue-i18n` selection of date format is responsibility of developer and not translators, and changing it requires changing application code.

In `fluent-vue` date format is part of localization messages and can be easily changed, if translation does not fit UI for example in some language.
`fluent-vue` date formatting is a function call of build-in function. It can easily be changed by [adding custom function](/howto/date-time.html#using-custom-library-for-date-formatting).

### fluent-vue

**Template**
```js
$t('now', { date: new Date() })
```

**Message**
```ftl
now = Now is { DATETIME($date, year: "numeric", month: "short", day: "numeric") }
```

### vue-i18n

**Setup code**
```js
new VueI18n({
  dateTimeFormats: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  }
})
```

**Template**
```js
$t('now', { date: $d(new Date(), 'short') })
```

**Message**
```
now = Now is {date}
```

## Linked messages

### fluent-vue

**Message**
```ftl
world = World
hello = Hello,
linked = { hello } { world }!
```

### vue-i18n

**Message**
```
world = World
hello = Hello,
linked = @:message.hello @:message.world!
```

