import { negotiateLanguages } from '@fluent/langneg'
import { FluentBundle } from '@fluent/bundle'

export function getOrderedBundles(
  requestedLocale: string | string[],
  bundles: FluentBundle[]
): FluentBundle[] {
  if (!Array.isArray(requestedLocale)) {
    requestedLocale = [requestedLocale]
  }

  const avaliableLocales = bundles.flatMap((bundle) => bundle.locales)
  const negotiatedLocales = negotiateLanguages(requestedLocale, avaliableLocales, {
    strategy: 'filtering',
  })

  const newBundles = negotiatedLocales.map((locale) =>
    bundles.find((bundle) => bundle.locales.includes(locale))
  )

  const dedupeBundles = newBundles
    .filter((bundle, i) => newBundles.indexOf(bundle) === i)
    .filter((bundle) => bundle != null) as FluentBundle[]

  return dedupeBundles
}
