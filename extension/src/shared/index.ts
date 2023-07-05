export enum ECommandId {
  DOWNLOAD_WORD = "download-word",
  DOWNLOAD_PDF = "download-pdf",
  TEST_COMMAND = "test-command",
}

export type Command = {
  id: ECommandId
  func: (params?: any) => void | Promise<void>
}

export type IMessage = {
  commandId: ECommandId
  params?: any
}
