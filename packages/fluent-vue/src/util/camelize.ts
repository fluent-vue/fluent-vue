const camelizeRE = /-(\w)/g

function camelizeSub(_: string, c: string) {
  return c ? c.toUpperCase() : ''
}

export function camelize(str: string): string {
  return str.replace(camelizeRE, camelizeSub)
}
