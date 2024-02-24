import {
  IMessage,
  storageChrome,
  storageLocal
} from "@/shared"
import { ROOT_STATE_STORAGE_KEY } from "./shared/models"
import { contentScript } from "./tools/content.executor"
// import "./assets/scss/content.scss"

console.log("Content script running...")

chrome.runtime.onMessage.addListener(async function (message: IMessage, sender, sendResponse) {
  // console.log("sender", sender)
  // console.log("message", message)
  if (message?.commandId) {
    try {
      // console.log("message", message)
      // console.log(_rootStore)

      // _rootStore.setProp("nextEvent", {
      //   id: message.commandId,
      //   type: message?.commandId,
      //   params: message?.params,
      // })
      const res = await contentScript.executeCommand(message)
      sendResponse(res)
    } catch (error) {
      sendResponse(error)
    }
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

;(async () => {
  // const { restoredState, unsubscribe } = await setupRootStore(_rootStore, {
  //   storageType: "chromeStorage",
  // })
  // console.log("restoredState", restoredState)
  // const swaggerUI = new SwaggerUIX({ initOnPageLoaded: false, storageType: "chromeStorage" })
  // ;(window as any).swaggerUI = swaggerUI
  // await storageLocal.set(ROOT_STATE_STORAGE_KEY, await storageChrome.get(ROOT_STATE_STORAGE_KEY))

  chrome.storage.onChanged.addListener((changes, namespace) => {
    // console.log(
    //   `[${namespace}] on change`,
    //   JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.oldValue),
    //   JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.newValue),
    // )
    // console.log("chrome change")
    if (namespace === "local") {
      storageLocal.set(ROOT_STATE_STORAGE_KEY, changes?.[ROOT_STATE_STORAGE_KEY]?.newValue)
    }
  })

  storageLocal.onChange((changes) => {
    if (changes?.[ROOT_STATE_STORAGE_KEY]?.newValue) {
      // console.log("local change")

      const newRootStore = changes?.[ROOT_STATE_STORAGE_KEY]?.newValue
      storageChrome.set(ROOT_STATE_STORAGE_KEY, newRootStore)
    }
  })
})()

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
// chrome.devtools.network.onRequestFinished.addListener(function (request) {
//   console.log("request", request);

//   // if (request.response.bodySize > 40 * 1024) {
//   //   chrome.devtools.inspectedWindow.eval(
//   //     'console.log("Large image: " + unescape("' + escape(request.request.url) + '"))',
//   //   )
//   // }
// })
