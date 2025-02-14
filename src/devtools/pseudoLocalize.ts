const ASCII = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ACCENTED_ASCII = 'âḃćḋèḟĝḫíĵǩĺṁńŏṗɋŕśṭůṿẘẋẏẓḀḂḈḊḔḞḠḢḬĴḴĻḾŊÕṔɊŔṠṮŨṼẄẌŸƵ'

interface PseudolocalizationOptions {
  prefix: string
  suffix: string
  accents: boolean
}

export default function pseudoLocalize(str: string, options: PseudolocalizationOptions): string {
  let finalString = ''

  if (options.prefix)
    finalString += options.prefix

  for (let i = 0; i < str.length; i++) {
    const character = str[i]
    const convertedCharacter = options.accents
      ? ACCENTED_ASCII[ASCII.indexOf(character)] ?? character
      : character

    finalString += convertedCharacter
  }

  if (options.suffix)
    finalString += options.suffix

  return finalString
}
