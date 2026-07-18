---
description: fluent-vue API is similar but simpler than vue-i18n as most of the functionality is handled by Fluent syntax. It supports pluralization, date formatting, etc.
---

# Comparison with vue-i18n

I have created `fluent-vue` as a replacement for `vue-i18n` on a project I was working on. To make the transition as smooth as possible, I kept the API similar to `vue-i18n`. If you're curious about my reasons for switching from `vue-i18n`, you can read about it in my blog post: [Difficulties you might encounter when using vue-i18n in real-world Vue.js applications](https://demivan.me/posts/vue-i18n-difficulties).

If you're familiar with `vue-i18n`, you'll find fluent-vue API quite similar. However, there are some key differences.

Firstly, the API surface of `fluent-vue` is smaller than that of `vue-i18n`. This is because `fluent-vue` leverages powerfull [Fluent syntax](/fluent-syntax) to handle most of the things. As a result, `fluent-vue` only has two methods (one of which is rarely used), while `vue-i18n` has five. Pluralization, number and date formatting, genders and grammatical cases are all handled by Fluent syntax itself.

Moreover, `fluent-vue` is compatible with both Vue.js version 2 and 3 with the same API, making it easier to upgrade your application without worrying about compatibility issues.

## Formatting

Simple formatting API in `fluent-vue` is very similar to `vue-i18n`.

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

So in `fluent-vue` adding pluralization can be done without changing app code just changing localization message.

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

Both `fluent-vue` and `vue-i18n` use [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for date formatting. With `vue-i18n` selection of date format is responsibility of developer and not translators, and changing it requires changing app code.

In `fluent-vue` date format is part of localization messages and can be changed, if translation doesn't fit UI for example in some language.
`fluent-vue` date formatting is a function call of build-in function. It can be changed by [adding custom function](/howto/date-time#using-custom-library-for-date-formatting).

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

