---
description: The bulk of functionality of fluent-vue comes from the power of Fluent syntax. All the pluralization, date, time, and number formatting are handled by Fluent.
keywords: vue.js, vue, js, i18n, internationalization, localization, fluent, ftl, pluralization, plural, date format, number format
---

# Fluent syntax

*This page uses content from the official Mozilla [Fluent website](https://projectfluent.org/), licensed under the [Creative Commons BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) license.*

The bulk of functionality of `fluent-vue` comes from the power of Fluent syntax (<abbr title="Fluent Translation List">FTL</abbr>). All the pluralization, date, time, and number formatting are handled by Fluent. Developers do not need to handle these aspects of localization in the app code.

Here is the excerp from [Fluent Syntax Guide](https://www.projectfluent.org/fluent/guide/) with basic terms and functionality that Fluent syntax provides.

### Placeables

Text in Fluent can use special syntax to incorporate small pieces of programmable interface. Those pieces are denoted with curly braces `{` and `}` and are called placeables.

Placeables can be used to interpolate external variables into the translation, interpolate other messages and terms or insert special characters.

### Variables

Variables are parameters received from the app. They are provided by the developer and can be interpolated into the translation.

```ftl
welcome = Welcome, { $user }!
unread-emails = { $user } has { $email-count } unread emails.
```

Numbers and dates are automatically formatted according to target language formatting rules.

### Select expression

```ftl
emails = { $unreadEmails ->
    [one] You have one unread email.
   *[other] You have { $unreadEmails } unread emails.
}
```

FTL has the select expression syntax, which allows to define multiple variants of the translation and choose between them based on the value of the selector. Select expression is often used to pluralize messages. The `*` indicator identifies the default variant. A default variant is required.

The selector may be a string, in which case it will be compared directly to the keys of variants.

```ftl
added-photos = {$userName} added new photos to {$userGender ->
    [male] his album
    [female] her album
   *[other] their album
}.
```

For selectors that are numbers, the variant keys either match the number exactly or they match the [CLDR plural category](https://www.unicode.org/cldr/cldr-aux/charts/30/supplemental/language_plural_rules.html) for the number. The possible categories are: `zero`, `one`, `two`, `few`, `many`, and `other`. For instance, English has two plural categories: `one` and `other`.

Using formatting options also allows for selectors using ordinal rather than cardinal plurals:

```ftl
your-rank = { NUMBER($pos, type: "ordinal") ->
   [1] You finished first!
   [one] You finished {$pos}st
   [two] You finished {$pos}nd
   [few] You finished {$pos}rd
  *[other] You finished {$pos}th
}
```

### Functions

Functions provide additional functionality available to the translators. They can be either used to format data or can provide additional data that the translator may use (like, current user gender, or time of the day) to fine tune the translation. The list of available functions is extensible.

There are two built-in functions `NUMBER` and `DATETIME`.

#### `NUMBER` function

Formats a number to a string in a given locale.

See the [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) for the description of the parameters.

```ftl
pi = π is { NUMBER($pi, maximumFractionDigits: 4) }
```

Result:

```
π is 3.1415
```

#### `DATETIME` function

Formats a date and time to a string in a given locale. Main page: [Localizing date and time](/howto/date-time.html)

See the [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) for the description of the parameters.

```ftl
today-is = Today is { DATETIME($date, month: "long", year: "numeric", day: "numeric") }
```

Result:

```
Today is ⁨September 10, 2021⁩
```

### Referencing messages

Referencing other messages generally helps to keep certain translations consistent across the interface and makes maintenance easier.

```ftl
menu-save = Save
help-menu-save = Click { menu-save } to save the file.
```

### Attributes

UI elements often contain multiple translatable messages per one element. In order to prevent having to define multiple separate messages for representing different strings within a single element, FTL allows you to add attributes to messages.

```ftl
login-input = Predefined value
    .placeholder = email@example.com
    .aria-label = Login input value
    .title = Type your login email
```

Attributes may also be used to define grammatical properties of [terms](/fluent-syntax.html#terms). Attributes of terms are private and cannot be retrieved by the localization runtime. They can only be used as [selectors](/fluent-syntax.html#select-expression).

### Terms

Terms are similar to regular messages but they can only be used as references in other messages.

```ftl
-brand-name = Firefox

about = About { -brand-name }.
update-successful = { -brand-name } has been updated.
```

#### Parameterized Terms

Term values follow the same rules as message values. They can be simple text, or they can interpolate other expressions, including variables.

By passing variables into the term, you can define select expressions with multiple variants of the same term value.

In many inflected languages (e.g. German, Finnish, Hungarian, all Slavic languages), the about preposition governs the grammatical case of the complement. For example in Polish language:

```ftl
-brand-name = { $case ->
   *[nominative] Firefox
    [locative] Firefoxa
}

# "About Firefox."
about = Informacje o { -brand-name(case: "locative") }.
```

#### Terms and Attributes

Sometimes translations might vary depending on some grammatical trait of a term references in them. Terms can store this grammatical information about themselves in [attributes](/fluent-syntax.html#attributes).

```ftl
-brand-name = Aurora
    .gender = feminine

update-successful = { -brand-name.gender ->
    [masculine] { -brand-name} został zaktualizowany.
    [feminine] { -brand-name } została zaktualizowana.
   *[other] Program { -brand-name } został zaktualizowany.
}
```

Use attributes to describe grammatical traits and properties. Genders, animacy, whether the term message starts with a vowel or not etc.

### Comments

Comments in Fluent start with `#`, `##`, or `###`, and can be used to document messages and to define the outline of the file.

Single-hash comments (`#`) can be standalone or can be bound to messages. If a comment is located right above a message it is considered part of the message.

Double-hash comments (`##`) are always standalone. They can be used to divide files into smaller groups of messages related to each other; they are group-level comments.

Triple-hash comments (`###`) are also always standalone and apply to the entire file; they are file-level comments.

```ftl
### Localization for Server-side strings of Firefox Screenshots

## Global phrases shared across pages

home-link = Home

## Creating page

# Note: { $title } is a placeholder for the title of the web page
# captured in the screenshot. The default, for pages without titles, is
# creating-page-title-default.
creating-page-title = Creating { $title }
creating-page-title-default = page
```
