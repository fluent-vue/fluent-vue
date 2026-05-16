const ASCII = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ACCENTED_ASCII = 'âḃćḋèḟĝḫíĵǩĺṁńŏṗɋŕśṭůṿẘẋẏẓḀḂḈḊḔḞḠḢḬĴḴĻḾŊÕṔɊŔṠṮŨṼẄẌŸƵ'

interface PseudolocalizationOptions {
  prefix: string
  suffix: string
  accents: boolean
  expand: number
}

export default function pseudoLocalize(str: string, options: PseudolocalizationOptions): string {
  let pseudoString = ''
  for (let i = 0; i < str.length * options.expand; i++) {
    const index = Math.floor(i / options.expand)
    const character = str[index]
    const convertedCharacter = options.accents
      ? ACCENTED_ASCII[ASCII.indexOf(character)] ?? character
      : character

    pseudoString += convertedCharacter
  }

  return options.prefix + pseudoString + options.suffix
}
