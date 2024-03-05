import { Command, ECommandId, IMessage, getGlobalVar } from "@/shared"
import { downloadPdf } from "./downloadPdf"
import { downloadWord } from "./downloadWord"

class ContentExecutor {
  commands: Command[] = [
    {
      id: ECommandId.DOWNLOAD_PDF,
      func: downloadPdf,
    },
    {
      id: ECommandId.DOWNLOAD_WORD,
      func: downloadWord,
    },
    {
      id: ECommandId.TEST_COMMAND,
      func: () => {
        console.log("test command")
        // render()
      },
    },
    {
      id: ECommandId.GET_RECAPTCHA_TOKEN,
      func: (params: any) => {
        return new Promise<string>((resolve) => {
          const grecaptcha = getGlobalVar("grecaptcha") as any

          grecaptcha
            ?.execute(params.siteKey, { action: params?.action })
            .then(function (token: string) {
              resolve(token)
            })
        })
      },
    },
  ]

  async executeCommand(message: IMessage) {
    const { commandId, params } = message
    const command = this.commands.find((command) => command.id === commandId)
    if (command) {
      return await command?.func?.(params)
    }
  }
}

export const contentScript = new ContentExecutor()
