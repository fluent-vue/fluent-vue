# Handling date and time

Fluent has build-in function for formatting date and time: `DATETIME`. It uses `Intl.DateTimeFormat` under the hood.

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

### Example

<<< @/components/DateTime.vue#snippet

<date-time />

## Using custom library for date formatting

Of course, you can add and use custom function for date and time formatting.

Example of using `date-fns`:

### Add custom function to the bundle
<<< @/.vuepress/enhanceApp.js#datefns

### Use it

<<< @/components/DateTimeCustom.vue#snippet

<date-time-custom />
