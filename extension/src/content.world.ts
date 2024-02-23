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
import { getGlobalVar, isMatchWebsite } from "./shared"
;(async () => {
  // set up the RootStore (returns the state restored from AsyncStorage)
  const { restoredState, unsubscribe } = await setupRootStore(_rootStore, {
    storageType: "localStorage",
  })
  if (
    isMatchWebsite(_rootStore.website.swaggerTool.matchRegexUrls) &&
    !window.location?.host?.includes("127.0.0.1:5500")
  ) {
    const SwaggerUIBundle = getGlobalVar("SwaggerUIBundle")
    if (SwaggerUIBundle) {
      setTimeout(() => {
        const swaggerUIBundle = SwaggerUIBundle({
          url: `${location?.href?.split("#")?.[0]}-json`,
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle?.presets?.apis, SwaggerUIBundle?.SwaggerUIStandalonePreset],
        })

        ;(window as any).swaggerUIBundle = swaggerUIBundle

        const swaggerUI = new SwaggerUIX({ storageType: "localStorage", swaggerUIBundle })
        console.log("_rootStore.website.swaggerTool", _rootStore.website.swaggerTool)

        if (_rootStore.website.swaggerTool.autoInitUI) {
          swaggerUI.initUI()
          swaggerUI.login()
        }
        ;(window as any).swaggerUI = swaggerUI
      }, 1500)
    }
  }
})()

const injectRecaptcha = (siteKey: string) => {
  const recaptcha = document.createElement("script")
  recaptcha.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
  recaptcha.async = true
  recaptcha.defer = true
  document.head.appendChild(recaptcha)

  function getToken() {
    const grecaptcha = getGlobalVar("grecaptcha") as any
    return new Promise<string | null>((resolve) => {
      if (grecaptcha) {
        grecaptcha.execute(siteKey, { action: "submit" }).then(function (token: string) {
          console.log(token)
          resolve(token)
        })
      } else {
        resolve(null)
      }
    })
  }

  return recaptcha
}
