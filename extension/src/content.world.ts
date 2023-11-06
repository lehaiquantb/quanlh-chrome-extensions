import { ROOT_STATE_STORAGE_KEY, _rootStore, setupRootStore, useInitialRootStore } from "./shared/models"
import { SwaggerUIX } from "./shared/website/swagger/swagger-ui"
import { parseJson } from "./shared/helper.common"
;(async () => {
  // set up the RootStore (returns the state restored from AsyncStorage)
  const { restoredState, unsubscribe } = await setupRootStore(_rootStore, {
    storageType: "chromeStorage",
  })
  console.log(parseJson(_rootStore), restoredState)
  // console.log("rehydrated")
  const swaggerUI = new SwaggerUIX({ initOnPageLoaded: false, storageType: "chromeStorage" })
  ;(window as any).swaggerUI = swaggerUI
  // For DEBUG: reactotron integration with the MST root store (DEV only)

  // let the app know we've finished rehydrating

  // invoke the callback, if provided
})()

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   console.log(
//     `[${namespace}] on change`,
//     JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.oldValue),
//     JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.newValue),
//   )
// })
