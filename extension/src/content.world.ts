import config from "./shared/config"
import { _rootStore } from "./shared/models"
import { SwaggerUIX } from "./shared/website/swagger/swagger-ui"
import { setupRootStore } from "./shared/models/helpers/setupRootStore"
import "./assets/scss/copy-field.scss"

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   console.log(
//     `[${namespace}] on change`,
//     JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.oldValue),
//     JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.newValue),
//   )
// })
import { isMatchWebsite } from "./shared"
;(async () => {
  // set up the RootStore (returns the state restored from AsyncStorage)
  const { restoredState, unsubscribe } = await setupRootStore(_rootStore, {
    storageType: "localStorage",
  })
  if (
    isMatchWebsite(_rootStore.website.swaggerTool.matchRegexUrls) &&
    !window.location?.host?.includes("127.0.0.1:5500")
  ) {
    const swaggerUI = new SwaggerUIX({ storageType: "localStorage" })

    if (_rootStore.website.swaggerTool.autoInitUI) {
      swaggerUI.initUI()
      swaggerUI.login()
    }
    ;(window as any).swaggerUI = swaggerUI
  }
})()
