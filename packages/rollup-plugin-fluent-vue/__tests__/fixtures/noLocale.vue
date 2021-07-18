<template>
  <div>
    <div>{{ $t('hello-user', { userName }) }}</div>
    <div>{{ $t('shared-photos', { userName, photoCount, userGender }) }}</div>
  </div>
</template>

<fluent>
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
</fluent>