# Handling date and time

Fluent has build-in function for formatting date and time: `DATETIME`. It uses `Intl.DateTimeFormat` under the hood.

### Example:

```ftl
today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }
```

### Parameters:

```
hour12
weekday
era
year
month
day
hour
minute
second
timeZoneName
```

See the [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for the description of the parameters.

### Example component

@[code{11-33}](../components/DateTime.vue)

<date-time />

## Using custom library for date formatting

You can add custom function for date and time formatting instead of using built-in one.

Example of using `date-fns`:

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
