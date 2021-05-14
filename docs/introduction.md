# Introduction

`fluent-vue` is [Vue.js](https://vuejs.org) integration for [Fluent.js](https://github.com/projectfluent/fluent.js) - JavaScript implementation of [Project Fluent](https://projectfluent.org)

Project Fluent keeps simple things simple and makes complex things possible. The syntax used for describing translations is easy to read and understand. At the same time it allows, when necessary, to represent complex concepts from natural languages like gender, plurals, conjugations, and others.

```
# Simple things are simple.
hello-user = Hello, {$userName}!

# Complex things are possible.
shared-photos =
  {$userName} {$photoCount ->
     [one] added one photo
    *[other] added {$photoCount} new photos
  } to {$userGender ->
     [male] his stream
     [female] her stream
    *[other] their stream
  }.
```

## FTL syntax

FTL is a localization file format used for describing translation resources. FTL stands for _Fluent Translation List_.

Read the [Fluent Syntax Guide](https://www.projectfluent.org/fluent/guide/) in order to learn more about the syntax.
