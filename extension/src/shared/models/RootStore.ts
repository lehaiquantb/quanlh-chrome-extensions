import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";
import { SETTING_STORE_DEFAULT, SettingStoreModel } from "./SettingStore";

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    settingStore: types.optional(SettingStoreModel, SETTING_STORE_DEFAULT),
    syncUserAt: types.maybe(types.string),
    startAt: types.optional(types.string, new Date().toISOString()),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setStartAt: (startAt: string) => {
      self.startAt = startAt;
    },
  }));

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}