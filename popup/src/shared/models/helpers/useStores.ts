import { createContext, useContext, useEffect, useState } from "react"
import { RootStore, RootStoreModel } from "../RootStore"
import { ROOT_STATE_STORAGE_KEY, setupRootStore } from "./setupRootStore"
import makeInspectable from "mobx-devtools-mst"
import { applySnapshot } from "mobx-state-tree"
import { StorageType, chrome, getRuntimeEnvironment, storageLocal } from "@/shared"

/**
 * Create the initial (empty) global RootStore instance here.
 *
 * Later, it will be rehydrated in app.tsx with the setupRootStore function.
 *
 * If your RootStore requires specific properties to be instantiated,
 * you can do so here.
 *
 * If your RootStore has a _ton_ of sub-stores and properties (the tree is
 * very large), you may want to use a different strategy than immediately
 * instantiating it, although that should be rare.
 */
export const _rootStore = RootStoreModel.create({})

/**
 * The RootStoreContext provides a way to access
 * the RootStore in any screen or component.
 */
const RootStoreContext = createContext<RootStore>(_rootStore)

/**
 * You can use this Provider to specify a *different* RootStore
 * than the singleton version above if you need to. Generally speaking,
 * this Provider & custom RootStore instances would only be used in
 * testing scenarios.
 */
export const RootStoreProvider = RootStoreContext.Provider

/**
 * A hook that screens and other components can use to gain access to
 * our stores:
 *
 * const rootStore = useStores()
 *
 * or:
 *
 * const { someStore, someOtherStore } = useStores()
 */
export const useStores = () => useContext(RootStoreContext)

/**
 * Used only in the app.tsx file, this hook sets up the RootStore
 * and then rehydrates it. It connects everything with Reactotron
 * and then lets the app know that everything is ready to go.
 */
export const useInitialRootStore = (
  callback: () => void | Promise<void>,
  opts?: {
    storageType: StorageType
    needTrackingStorageLocal?: boolean
    needTrackingStorageChrome?: boolean
  },
) => {
  const rootStore = useStores()
  const [rehydrated, setRehydrated] = useState(false)

  // Kick off initial async loading actions, like loading fonts and rehydrating RootStore
  useEffect(() => {
    const storageType = opts?.storageType ?? "chromeStorage"
    const needTrackingStorageLocal = opts?.needTrackingStorageLocal ?? true
    const needTrackingStorageChrome = opts?.needTrackingStorageChrome ?? true
    let listener: any
    let _unsubscribe: () => void
    let timeout: any
    ;(async () => {
      // set up the RootStore (returns the state restored from AsyncStorage)
      const { restoredState, unsubscribe } = await setupRootStore(rootStore, {
        ...(opts ?? {}),
        storageType,
      })
      _unsubscribe = unsubscribe

      // For DEBUG: reactotron integration with the MST root store (DEV only)

      // makeInspectable(rootStore)

      // For DEBUG: make some changes to show the root store in mst dev mode but it make storage being updated continuously => make logic wrong
      // timeout = setTimeout(() => {
      //   rootStore.setProp("timeNow", `${new Date().getTime()}`)
      // }, 1000)
      // rootStore.setProp("timeNow", `${new Date().getTime()}`)

      // let the app know we've finished rehydrating
      setRehydrated(true)

      // invoke the callback, if provided
      if (callback) {
        callback()
      }

      if (needTrackingStorageLocal && storageType === "localStorage") {
        // storageLocal.onChange((changes) => {
        //   if (changes?.[ROOT_STATE_STORAGE_KEY]?.newValue) {
        //     const newRootStore = changes?.[ROOT_STATE_STORAGE_KEY]?.newValue
        //     applySnapshot(rootStore, JSON.parse(newRootStore))
        //   }
        // })
      }

      if (needTrackingStorageChrome && storageType === "chromeStorage") {
        listener = (
          changes: { [key: string]: chrome.storage.StorageChange },
          namespace: chrome.storage.AreaName,
        ) => {
          if (changes?.[ROOT_STATE_STORAGE_KEY]?.newValue && namespace === "local") {
            const newRootStore = changes?.[ROOT_STATE_STORAGE_KEY]?.newValue
            applySnapshot(rootStore, JSON.parse(newRootStore))
          }
        }

        chrome?.storage?.onChanged?.addListener(listener)
      }
    })()

    // const envs = getRuntimeEnvironment()
    // const needTrackingStorage =
    //   (envs?.includes("content_script") || envs?.includes("background")) && !envs?.includes("popup")

    return () => {
      // cleanup
      if (_unsubscribe) {
        _unsubscribe()
      }
      if (needTrackingStorageChrome && listener) {
        chrome?.storage?.onChanged?.removeListener(listener)
      }
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return { rootStore, rehydrated }
}
