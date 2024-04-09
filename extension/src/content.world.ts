/**
 * IMPORTANT: chrome not available in content worl script
 */

import config from "./shared/config"
import { _rootStore } from "./shared/models"
import { SwaggerUIX } from "./shared/website/swagger/swagger-ui"
import { ROOT_STATE_STORAGE_KEY, setupRootStore } from "./shared/models/helpers/setupRootStore"
import "./assets/scss/copy-field.scss"

// import "./assets/css/swagger-ui.min.css"
// import "./assets/js/swagger-ui-bundle.min.js"

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   console.log(
//     `[${namespace}] on change`,
//     JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.oldValue),
//     JSON.parse(changes?.[ROOT_STATE_STORAGE_KEY]?.newValue),
//   )
// })
import {
  IMessage,
  delay,
  getGlobalVar,
  isMatchWebsite,
  parseJson,
  storageLocal,
  waitUntil,
} from "./shared"
import { contentScript } from "./tools/content.executor"
import { imageViewerManager } from "./tools/ImageViewerManager"
import HELPER from "./shared/helper.common"

// const injectRecaptcha = (siteKey: string) => {
//   const recaptcha = document.createElement("script")
//   recaptcha.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
//   recaptcha.async = true
//   recaptcha.defer = true
//   document.head.appendChild(recaptcha)

//   function getToken() {
//     const grecaptcha = getGlobalVar("grecaptcha") as any
//     return new Promise<string | null>((resolve) => {
//       if (grecaptcha) {
//         grecaptcha.execute(siteKey, { action: "submit" }).then(function (token: string) {
//           console.log(token)
//           resolve(token)
//         })
//       } else {
//         resolve(null)
//       }
//     })
//   }

//   return recaptcha
// }

// storageLocal.onChange(async (c) => {
//   const newValue = parseJson(c?.[ROOT_STATE_STORAGE_KEY]?.newValue)

//   const { nextEvent } = newValue
//   if (nextEvent?.type) {
//     const res = await contentScript.executeCommand({
//       commandId: nextEvent.type,
//       params: nextEvent.params,
//     })
//     console.log("[TOKEN]", res)
//   }
// })

// storageLocal.onChange(async (c) => {
//   const newValue = parseJson(c?.[ROOT_STATE_STORAGE_KEY]?.newValue)

//   const { nextEvent } = newValue
//   if (nextEvent?.type) {
//     const res = await contentScript.executeCommand({
//       commandId: nextEvent.type,
//       params: nextEvent.params,
//     })
//     console.log("[TOKEN]", res)
//   }
// })

const setupSwagger = async () => {
  // set up the RootStore (returns the state restored from AsyncStorage)
  const { restoredState, unsubscribe } = await setupRootStore(_rootStore, {
    storageType: "localStorage",
  })

  if (window.location?.href?.includes("/v3/api-docs")) {
    const baseUrl = window.location?.href?.split("/v3/api-docs")?.[0]
    const SwaggerUIBundle = getGlobalVar("SwaggerUIBundle")
    const swaggerDiv = document.createElement("div", {})
    swaggerDiv.id = "swagger-ui"
    swaggerDiv.style.backgroundColor = "white"
    document.body.innerHTML = ""
    document.body.appendChild(swaggerDiv)
    if (SwaggerUIBundle) {
      let ready = false
      setTimeout(async () => {
        const UrlMutatorPlugin = (system: any) => ({
          rootInjects: {
            setServer: (server: string) => {
              const jsonSpec = system.getState().toJSON().spec.json
              const servers = [{ url: server }]
              const newJsonSpec = Object.assign({}, jsonSpec, { servers })
              return system?.getSystem()?.specActions?.updateJsonSpec(newJsonSpec)
            },
          },
        })
        const swaggerUIBundle = SwaggerUIBundle({
          url: `${location?.href}`,
          dom_id: "#swagger-ui",
          presets: [
            SwaggerUIBundle?.presets?.apis,
            SwaggerUIBundle?.SwaggerUIStandalonePreset,
            UrlMutatorPlugin,
          ],
          onComplete: () => {
            ready = true
            ;(window as any)?.swaggerUIBundle?.setServer(baseUrl)
          },
        })
        ;(window as any).swaggerUIBundle = swaggerUIBundle

        await waitUntil(() => ready, 300, 20)

        const swaggerUI = new SwaggerUIX({ storageType: "localStorage", swaggerUIBundle })
        swaggerUI._baseUrl = baseUrl
        swaggerUI.loginMethod = "2"
        // console.log("_rootStore.website.swaggerTool", _rootStore.website.swaggerTool)

        if (_rootStore.website.swaggerTool.autoInitUI) {
          await swaggerUI.initUI()
          // swaggerUI.login(undefined, undefined, true)
        }
        ;(window as any).swaggerUI = swaggerUI
      }, 3000)
    }
  } else if (
    isMatchWebsite(_rootStore.website.swaggerTool.matchRegexUrls) &&
    !window.location?.host?.includes("127.0.0.1:5500")
  ) {
    const SwaggerUIBundle = getGlobalVar("SwaggerUIBundle")
    if (SwaggerUIBundle) {
      let ready = false
      setTimeout(async () => {
        const swaggerUIBundle = SwaggerUIBundle({
          url: `${location?.href?.split("#")?.[0]}-json`,
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle?.presets?.apis, SwaggerUIBundle?.SwaggerUIStandalonePreset],
          onComplete: () => {
            ready = true
          },
        })

        await waitUntil(() => ready, 300, 20)
        ;(window as any).swaggerUIBundle = swaggerUIBundle

        const swaggerUI = new SwaggerUIX({ storageType: "localStorage", swaggerUIBundle })
        console.log("_rootStore.website.swaggerTool", _rootStore.website.swaggerTool)

        if (_rootStore.website.swaggerTool.autoInitUI) {
          await swaggerUI.initUI()
          swaggerUI.login(undefined, undefined, true)
        }
        ;(window as any).swaggerUI = swaggerUI
      }, 3000)
    }
  }
}

const Q__ = {
  imageViewerManager,
  HELPER,
}

;(window as any).Q__ = Q__

// eslint-disable-next-line @typescript-eslint/no-empty-function
window.addEventListener("DOMContentLoaded", () => {})
;(async () => {
  try {
    // imageViewerManager.execute()
    await setupSwagger()
  } catch (error) {
    console.log("error", error)
  }
})()
