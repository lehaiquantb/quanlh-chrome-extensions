import { _rootStore, setupRootStore } from "@/shared/models"
import { SwaggerUIX } from "./swagger-ui"

// test
// const swaggerUI = new SwaggerUIX({ initOnPageLoaded: true, storageType: "localStorage" })
// swaggerUI.initUI()
;(async () => {
  // set up the RootStore (returns the state restored from AsyncStorage)
  const { restoredState, unsubscribe } = await setupRootStore(_rootStore, {
    storageType: "localStorage",
  })
  const swaggerUI = new SwaggerUIX({ storageType: "localStorage" })

  swaggerUI.initUI()

  swaggerUI.login()
  ;(window as any).swaggerUI = swaggerUI
})()