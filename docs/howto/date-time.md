---
description: 'fluent-vue has built-in date and time formatting using native js methods. But it allows custom implementation using any library you want: dayjs, date-fns, moment, etc.'
---

# Localizing date and time

Fluent has build-in function for formatting date and time: `DATETIME`. It uses [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) under the hood.

### Example:

```ftl
today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }
```

### Parameters:

Here is the list of most commonly used parameters:

**dateStyle**: `[ 'full', 'long', 'medium', 'short' ]`  
**timeStyle**: `[ 'full', 'long', 'medium', 'short' ]`  
**month**: `[ 'numeric', '2-digit', 'long', 'short', 'narrow' ]`  
**year**: `[ 'numeric', '2-digit' ]`  
**weekday**: `[ 'long', 'short', 'narrow' ]`  
**day, hour, minute and second**: `[ 'numeric', '2-digit' ]`  

See the [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for the rest of the parameters and their description.

### Example component

@[code{11-33}](../components/DateTime.vue)

<date-time />

## Using custom library for date formatting

You can add a custom function for date or time formatting instead of using the built-in one.

For example you can use `date-fns`:

### Add custom function to the bundle

```ts
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

@[code{11-33}](../components/DateTimeCustom.vue)

<date-time-custom />
