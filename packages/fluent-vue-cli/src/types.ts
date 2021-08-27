export interface SFCFileInfo {
  path: string
  content: string
}

export interface SFCFluentBlock {
  locale: string
  messages: Record<string, string>
}
