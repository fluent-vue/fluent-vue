# Api

## `$t` method

Retrieves localized `key` message passing `values` properties as variables to the message.

* Arguments
  * `{string} key`: required
  * `{object} values`: optional
  
* Returns: `{string}`

Message:
```
greating = Hello, {$name}
```

Template:
```html
<p>{{ $t('greeting', { name: 'World' }) }}</p>
```

Result:
```html
<p>Hello, World</p>
```

## `$ta` method

Retreives localized `key` message attributes passing `values` properties as variables to the message.  
This allows for easy binding of multiple localizable element attributes.

* Arguments
  * `{string} key`: required
  * `{object} values`: optional

* Returns: `{object}`

Message:
```
login-input =
    .placeholder = email@example.com
    .aria-label = Login input value
    .title = Type your login email
```

Template:
```html
<input v-bind="$ta('login-input')"  type="email">
```

Result:
```html
<input placeholder="email@example.com" aria-label="Login input value" title="Type your login email" type="email">
```

## `v-t` directive

Combines `$t` and `$ta` methods binding message and its attributes to `innerText` and html attributes.

::: tip Note
By default only localizable html attributes are bound (aria-label, title, alt, etc). Directive modifiers allow specifying additional attributes to bind.
:::

Usage: `v-t:key.modifier="values"`.

* Argument:
  * `key {string}`: required
* Value:
  * `values {object}`: optional
* Modifiers:
  * `{string}`: optional

Message:
```
link = Hello, {$userName}!
    .aria-label = Welcome message for {$userName}
```

Template:
```html
<a v-t:link="{ userName }" href="/login"></a>
```

Result:
```html
<a href="/login" aria-label="Welcome message for ⁨Jonh Doe⁩">Hello, ⁨Jonh Doe⁩</a>
```

## `i18n` component

Allows to use Vue components inside translations.

* Props:
  * `path {string}` localization message key
  * `tag {string}` html tag to generate
  * `args {object}` message parameters

Message:
```
greeting = Hello, {$userName}!
```

Template:
```html
<i18n path="greeting" tag="div">
  <template #userName>
    <b>World</b>
  </template>
</i18n>
```

Result:
```html
<div>Hello, <b>World</b>!</div>
```
