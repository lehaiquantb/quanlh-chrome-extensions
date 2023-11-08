import { ToolModel } from "./shared/models/website/ToolModel"
import { Command, ECommandId, IMessage, parseJson, storageChrome, storageLocal } from "@/shared"
import { downloadPdf } from "./tools/downloadPdf"
import { downloadWord } from "./tools/downloadWord"
import { render } from "./shared/components/css-to-tailwind/TailwindClassField"
import { ROOT_STATE_STORAGE_KEY, _rootStore } from "./shared/models"
import { forEach } from "lodash"
import { ToolSnapshot } from "@/shared/models"
import { SwaggerUIX } from "./shared/website/swagger/swagger-ui"
import { setupRootStore } from "./shared/models/helpers/setupRootStore"
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
  // console.log(
  //   `[${namespace}] on change`,
  //   JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.oldValue),
  //   JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.newValue),
  // )
  storageLocal.set(ROOT_STATE_STORAGE_KEY, changes?.[ROOT_STATE_STORAGE_KEY]?.newValue)
})

storageLocal.onChange((changes) => {
  if (changes?.[ROOT_STATE_STORAGE_KEY]?.newValue) {
    const newRootStore = changes?.[ROOT_STATE_STORAGE_KEY]?.newValue
    storageChrome.set(ROOT_STATE_STORAGE_KEY, newRootStore)
  }
})

chrome.runtime.onConnect.addListener(() => {
  console.log("on connect")
})

// storageLocal.onChange((value) => {
//   console.log("value", value)
// })

// const swaggerUI = new SwaggerUIX({ initOnPageLoaded: true })
// swaggerUI.initUI()
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
// ;(async () => {
//   // set up the RootStore (returns the state restored from AsyncStorage)
//   const { restoredState, unsubscribe } = await setupRootStore(_rootStore, {
//     storageType: "chromeStorage",
//   })
//   // console.log(parseJson(_rootStore), restoredState)
//   // // console.log("rehydrated")
//   // const swaggerUI = new SwaggerUIX({ initOnPageLoaded: false, storageType: "chromeStorage" })
//   // ;(window as any).swaggerUI = swaggerUI
//   // For DEBUG: reactotron integration with the MST root store (DEV only)

//   // let the app know we've finished rehydrating
//   console.log("hello", parseJson(_rootStore), restoredState)

//   // invoke the callback, if provided
// })()
