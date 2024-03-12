import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SETTING_STORE_DEFAULT, SettingStoreModel } from "./SettingStore"
import { WebsiteStoreModel } from "./WebsiteStore"
import { EventModel } from "./EventModel"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    settingStore: types.optional(SettingStoreModel, SETTING_STORE_DEFAULT),
    timeNow: types.maybe(types.string),
    startAt: types.optional(types.string, new Date().toISOString()),
    website: types.optional(WebsiteStoreModel, {}),
    nextEvent: types.optional(EventModel, { id: "", type: "" }),
    chromeRuntimeId: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setStartAt: (startAt: string) => {
      self.startAt = startAt
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
