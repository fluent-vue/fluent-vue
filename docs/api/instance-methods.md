# `$t` and `$ta` instance methods

### `$t` method

Formats message  with `key` identifier. `args` will be used to resolve references to variables passed as arguments to the translation.

* Arguments
  * `{string} key`: required
  * `{object} args`: optional

* Returns: `{string}`

Template:
```html
<p>{{ $t('greeting', { name: 'World' }) }}</p>
```

Message:
```ftl
greating = Hello, {$name}
```

Result:
```html
<p>Hello, World</p>
```

### `$ta` method

Formats message with `key` identifier, but only returns message attributes. `args` will be used to resolve references to variables passed as arguments to the translation.

This method should be used mostly for passing parameters to custom components. For localization of regular html elements [v-t](/api/v-t-directive) directive is more convenient.

* Arguments
  * `{string} key`: required
  * `{object} args`: optional

* Returns: `{object}`

Template:
```html
<input v-bind="$ta('login-input')" type="email">
```

Message:
```ftl
login-input =
    .placeholder = email@example.com
    .aria-label = Login input value
    .title = Type your login email
```

Result:
```html
<input placeholder="email@example.com" aria-label="Login input value" title="Type your login email" type="email">
```
