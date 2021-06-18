# `v-t` directive

Combines `$t` and `$ta` methods binding message and its attributes to `innerText` and html attributes of a html element.

::: tip Note
By default only localizable html attributes are bound (aria-label, title, alt, etc). Directive modifiers allow specifying additional attributes to bind.
:::

Usage: `v-t:key="values"`.

* Argument:
  * `key {string}`: required
* Value:
  * `values {object}`: optional
* Modifiers:
  * `{string}`: optional

Template:
```html
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
