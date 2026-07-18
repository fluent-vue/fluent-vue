---
description: i18n component allows localizing text that contains HTML elements or Vue.js components
---

# `i18n` component

::: tip Note
The component name can be customized via the `globals.component` option in `createFluentVue` to avoid naming conflicts. See [Installation](/installation#customizing-global-names) for details.
:::

A common problem when localizing web apps is text containing HTML elements or components. Consider this example:

```vue-html
<p>
  <router-link :to="{ name: 'login' }">Sign in</router-link>
  or
  <router-link :to="{ name: 'register' }">sign up</router-link>
  to add comments on this article.
</p>
```

One approach is to translate each part of the message separately:

```vue-html
<p>
  <router-link :to="{ name: 'login' }">{{ $t('sign-in') }}</router-link>
  {{ $t('or') }}
  <router-link :to="{ name: 'register' }">{{ $t('sign-up') }}</router-link>
  {{ $t('to-comment') }}
</p>
```

However, this is cumbersome and leads to confusion and errors. For translators, it is hard to see that these messages are actually a single sentence, which also makes it harder to reuse translations. This approach also complicates translating into languages that use a different sentence structure.

Another approach is using Vue's `v-html` directive, but that only works for simpler static HTML, not for components like router links or buttons. Improper formatting in the translation can also accidentally break a page, or even lead to security problems.

The `<i18n>` component solves these problems by allowing Vue components and HTML elements inside translation messages in a structured way. The previous example becomes:

```vue-html
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

The entire sentence uses a single translation key and does not use the `v-html` directive. It also allows for comments, so translators know what they are dealing with.

## API

Props:
* `path` (string): localization message key
* `tag` (string or `false`): html tag to generate; default is `<span>`. The literal `false` renders the result without a surrounding tag (Vue 3 only).
* `args` (object): message parameters
* `html` (boolean): whether to render HTML markup in the message; defaults to `false` which escapes any markup (if present). Important: only use this if you trust the translators (and their technical abilities); mistakes can break layout and malicious translations can lead to vulnerabilities.

Message:
```ftl
greeting = Hello, { $userName }!
greeting-with-html = Hello, <strong>{ $userName }</strong>!
```

Template:
```vue-html
<i18n path="greeting" tag="p">
  <template #userName>
    <strong>world</strong>
  </template>
</i18n>
<i18n html path="greeting-with-html" tag="p">
  <template #userName>world</template>
</i18n>
```

Result (in both cases):
```html
<p>Hello, <strong>world</strong>!</p>
```

## Scoped slots

Message attributes are passed as scoped slot parameters, which means the translation is contained in a single Fluent message. Message attributes have access to same parameters that the entire message has access to.

Message:
```ftl
sign-in-or-sign-up =
  {$signInLink} or {$signUpLink} to the site.
  .sign-in-label = Sign in
  .sign-up-label = sign up
```

Template:
```vue-html
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
