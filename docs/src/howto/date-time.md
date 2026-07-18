---
description: 'fluent-vue has built-in date and time formatting using native js methods. But it allows custom implementation using any library you want: dayjs, date-fns, moment, etc.'
head:
  - - meta
    - name: keywords
      content: vue, i18n, vue i18n, vue.js, vue plugin, fluent, project fluent, vue date format, vue datetime
---

<script setup>
  import DateTimeComponent from '../components/DateTime.vue'
  import DateTimeCustom from '../components/DateTimeCustom.vue'

  import { FluentDateTime } from '@fluent/bundle'

  const formatDateTime = (date) => new FluentDateTime(date, { weekday: 'long' })
</script>

# Localizing date and time

`fluent-vue` relies on Fluent syntax for formatting dates, numbers, etc. Fluent automatically selects a formatter for the argument and formats it using a given locale:

`Today is { $date }` -> `Today is {{ Intl.DateTimeFormat().format(new Date()) }}`

To allow greater control of date and time formatting, Fluent has a built-in function: `DATETIME`. It uses [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) under the hood.

In most cases, localizers don't need to call the function explicitly, thanks to the implicit formatting. But if the implicit formatting is not sufficient, the function can be called explicitly with additional parameters. Both developers and localizers can pass parameters to it.

### Specifying parameters by localizers:

Localizers can specify formatting options that are specific to the given locale.

```ftl
today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }
```

```js
$t('today-is', { date: new Date() })
```

Result: `{{ $t('today-is', { date: new Date() }) }}`

### Specifying parameters by developers:

The developer can annotate the argument with additional information on how to format it.

```ftl
today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }
```

```js
$t('today-is', { date: new FluentDateTime(new Date(), { weekday: 'long' }) })
```

Result: `{{ $t('today-is', { date: formatDateTime(new Date()) }) }}`

If the localizer wishes to modify the parameters, for example, because the string doesn't fit in the UI, they can pass the variable to the same function and overload the parameters set by the developer.

### Parameters:

Here is the list of most commonly used parameters:

**dateStyle**: `[ 'full', 'long', 'medium', 'short' ]`<br>
**timeStyle**: `[ 'full', 'long', 'medium', 'short' ]`<br>
**month**: `[ 'numeric', '2-digit', 'long', 'short', 'narrow' ]`<br>
**year**: `[ 'numeric', '2-digit' ]`<br>
**weekday**: `[ 'long', 'short', 'narrow' ]`<br>
**day, hour, minute, and second**: `[ 'numeric', '2-digit' ]`<br>

See the [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for the rest of the parameters and their description.

### Example

<<< @/components/DateTime.vue#snippet

::: info Output
<date-time-component />
:::

## Using custom library for date formatting

If `Intl.DateTimeFormat` functionality is no sufficient, you can use a custom function for date and time formatting instead of using the built-in one.

Here is an example of using `date-fns`:

### Add custom function to the bundle

```js
import { format } from 'date-fns'

const bundle = new FluentBundle('en', {
  functions: {
    DATEFNS (positionalArgs, namedArgs) {
      const [date, formatString] = positionalArgs as [string, string]
      return format(new Date(date), formatString)
    }
  }
})

const fluent = createFluentVue({
  bundles: [bundle],
})
```

### Use it

<<< @/components/DateTimeCustom.vue#snippet

::: info Output
<date-time-custom />
:::