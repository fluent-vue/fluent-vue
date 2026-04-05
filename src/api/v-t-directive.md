# `v-t` directive

Combines `$t` and `$ta` methods binding message and its attributes to `innerText` and HTML attributes of a HTML element.

::: tip Note
The directive name can be customized via the `globals.directive` option in `createFluentVue` to avoid naming conflicts. See [Installation](/installation#customizing-global-names) for details.
:::

::: tip Note
By default only localizable HTML attributes are bound (aria-label, title, alt, etc). Directive modifiers allow specifying additional attributes to bind.
:::

Usage: `v-t:key="values"`.

* Argument:
  * `key {string}`: required
* Value:
  * `values {object}`: optional
* Modifiers:
  * `{string}`: optional

Template:
```vue-html
<a v-t:link="{ userName }" href="/login"></a>
```

Message:
```ftl
link = Hello, {$userName}!
    .aria-label = Welcome message for {$userName}
```

Result:
```html
<a href="/login" aria-label="Welcome message for ⁨Jonh Doe⁩">Hello, ⁨Jonh Doe⁩</a>
```
