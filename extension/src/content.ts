import { ToolModel } from "./shared/models/website/ToolModel"
import { Command, ECommandId, IMessage, storageChrome } from "@/shared"
import { downloadPdf } from "./tools/downloadPdf"
import { downloadWord } from "./tools/downloadWord"
import { render } from "./shared/components/css-to-tailwind/TailwindClassField"
import { _rootStore } from "./shared/models"
import { forEach } from "lodash"
import { ToolSnapshot } from "@/shared/models"
import { SwaggerUIX } from "./shared/website/swagger/swagger-ui"
// import "./assets/scss/content.scss"

console.log("Content script running...")

chrome.runtime.onMessage.addListener(function (message: IMessage, sender, sendResponse) {
  console.log("sender", sender)
  console.log("message", message)
  if (message?.commandId) {
    contentScript.executeCommand(message)
  }
})

// const host = window.location.host

// function checkHost(host: string): boolean {
//   for (const enableHost of enableHostClipboardFeature) {
//     if (!enableHost.test(host)) {
//       return false
//     }
//   }

//   for (const disableHost of disableHostClipboardFeature) {
//     if (disableHost.test(host)) {
//       return false
//     }
//   }

//   return true
// }

// if (checkHost(host)) {
//   handleCopyCodeToClipboard()
// }
class ContentScript {
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
  ]

  executeCommand(message: IMessage) {
    const { commandId, params } = message
    const command = this.commands.find((command) => command.id === commandId)
    if (command) {
      command?.func?.(params)
    }
  }
}

export const contentScript = new ContentScript()

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("on change", changes, namespace)
})

chrome.runtime.onConnect.addListener(() => {
  console.log("on connect")
})
console.log(_rootStore?.startAt)

// const autoExecute = () => {
//   const { website } = _rootStore
//   forEach(website, (tool: , key) => {

//     if (tool.) {

//     }
//     console.log("value", value, key)

//     // if (value?.autoExecute) {
//     //   contentScript.executeCommand({
//     //     commandId: key,
//     //     params: value?.params,
//     //   })
//     // }
//   })
// }

// autoExecute()
