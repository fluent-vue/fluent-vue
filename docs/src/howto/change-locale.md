# Changing locale

To change locale you need to re-assign `bundles` property of fluent plugin instance to a new list of bundles.
Changing bundles list will automatically re-render all components that use translations.

```js
const enBundle = new FluentBundle('en')
const ukBundle = new FluentBundle('uk')

// Default locale - English
const fluent = createFluentVue({
  bundles: [enBundle]
})

// Change locale to Ukrainian
fluent.bundles = [ukBundle]
```
