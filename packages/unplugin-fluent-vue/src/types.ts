interface ExternalPluginOptionsBase {
  locales: string[]
  checkSyntax?: boolean
  virtualModuleName?: string
}

export interface ExternalPluginOptionsFolder extends ExternalPluginOptionsBase {
  baseDir: string
  ftlDir: string
}

export interface ExternalPluginOptionsFunction extends ExternalPluginOptionsBase {
  getFtlPath: (locale: string, vuePath: string) => string
}

export type ExternalPluginOptions = (ExternalPluginOptionsFolder | ExternalPluginOptionsFunction) & {
  /**
   * Whether to parse the ftl syntax before injecting it into component
   */
  parseFtl?: boolean
}

export interface SFCPluginOptions {
  /**
   * Whether to parse the ftl syntax before injecting it into component
   */
  parseFtl?: boolean
  /**
   * Vue custom block name
   */
  blockType?: string
  /**
   * Whether to check for syntax errors in the ftl source
   */
  checkSyntax?: boolean
}
