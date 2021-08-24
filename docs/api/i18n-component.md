---
description: i18n component allows localizing text that contains HTML elements or Vue.js components | fluent-vue - Vue.js internationalization plugin
---

# `i18n` component

Very common problem of localizing web apps is localizing text that needs to include HTML elements or components. Consider the example:

```html
<p>
  <router-link :to="{ name: 'login' }">Sign in</router-link>
  or
  <router-link :to="{ name: 'register' }">sign up</router-link>
  to add comments on this article.
</p>
```

One solution for this could be to translate each part of the message separatelly like this:

```html
<p>
  <router-link :to="{ name: 'login' }">{{ $t('sign-in') }}</router-link>
  {{ $t('or') }}
  <router-link :to="{ name: 'register' }">{{ $t('sign-up') }}</router-link>
  {{ $t('to-comment') }}
</p>
```

But this is cumbersome and could lead to confusion and errors, as it is hard to see that these messages are actually just one sentence.

Another solution is using v-html directive. But that only works for simpler static HTML. And it could lead to accidentaly breaking a page if the message is not properly formatted.

`i18n` component allows to use Vue components and HTML elements inside translation messages.

Previous example would look like this when using `i18n` component:

```html
<i18n path="sign-in-up-to-add-comments" tag="p">
  <template #signInLink="{ signInLabel }">
    <router-link :to="{ name: 'login' }">{{ signInLabel }}</router-link>
  </template>
  <template #signUpLink="{ signUpLabel }">
    <router-link :to="{ name: 'register' }">{{ signUpLabel }}</router-link>
  </template>
</i18n>
```

Localization message:
```ftl
# $signInLink - will be replaced with link to login page
# .sign-in-label - text for login link
sign-in-up-to-add-comments =
  {$signInLink} or {$signUpLink} to add comments on this article.
  .sign-in-label = Sign in
  .sign-up-label = sign up
```

As you can see entire sentence uses just one translation key. It does not use v-html directive. And we can even add comments, so translators know what they are dealing with.

### API

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