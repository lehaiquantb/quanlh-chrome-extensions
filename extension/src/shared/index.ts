import { getChrome } from "./helper.common"

export enum ECommandId {
  DOWNLOAD_WORD = "download-word",
  DOWNLOAD_PDF = "download-pdf",
  TEST_COMMAND = "test-command",
  GET_RECAPTCHA_TOKEN = "get-reCAPTCHA-token",
}

export type Command = {
  id: ECommandId
  func: (params?: any) => any | Promise<any>
}

export type IMessage = {
  commandId: ECommandId
  params?: any
}

export * from "./helper.common"
export * from "./services/storage"
export const chrome = getChrome()
