# Simple things are simple.
hello-user = Hello, {$userName}!

# Complex things are possible.
shared-photos =
  {$userName} {$photoCount ->
    [one] added one photo
   *[other] added {$photoCount} new photo
  } to {$userGender ->
    [male] his stream
    [female] her stream
   *[other] their stream
  }.
