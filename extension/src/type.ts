export enum ScriptId {
  DOWNLOAD_PDF,
  DOWNLOAD_WORD,
}

export interface ScriptType {
  id: ScriptId
  func?: () => any
}
