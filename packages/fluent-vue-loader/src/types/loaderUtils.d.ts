declare module 'loader-utils' {
  export interface OptionObject {
    [key: string]: null | false | true | string
  }

  export function parseQuery (optionString: string): OptionObject
}
