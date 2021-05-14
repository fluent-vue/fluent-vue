# `i18n` component

Allows to use Vue components and html elements inside translation messages.

* Props:
  * `path {string}` localization message key
  * `tag {string}` html tag to generate. Default is span
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

### Scoped slots

Message attributes are passed as scoped slot parameters. This allows to not split translation into multiple messages. And attributes have access to same parameters entire message has access to.

Message:
```
sign-in-or-sign-up =
  {$signInLink} or {$signUpLink} to the site.
  .sign-in-label = Sign in
  .sign-up-label = sign up
```

Template:
```html
<i18n path="sign-in-or-sign-up" tag="p">
  <template #signInLink="{ signInLabel }">
    <a href="/login">{{ signInLabel }}</a>
  </template>
  <template #signUpLink="{ signUpLabel }">
    <a href="/sign-up">{{ signUpLabel }}</a>
  </template>
</i18n>
```

Result:
```html
<p>⁨<a href="/login">Sign in</a>⁩ or ⁨<a href="/sign-up">sign up</a>⁩ to the site.</p>
```