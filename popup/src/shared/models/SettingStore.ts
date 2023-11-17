import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";
import { withSetPropAction } from "./helpers/withSetPropAction";
export const SettingStoreModel = types
  .model("SettingStoreModel")
  .props({
    baseUrl: types.optional(types.string, "SETTING_STORE_DEFAULT.baseUrl"),
  })
  .actions(withSetPropAction)
  .actions((self) => ({}));

export type Setting = Instance<typeof SettingStoreModel>;
export type SettingSnapshotOut = SnapshotOut<typeof SettingStoreModel>;
export type SettingSnapshotIn = SnapshotIn<typeof SettingStoreModel>;
export type SettingSnapshot = SnapshotOut<typeof SettingStoreModel>;

export const SETTING_STORE_DEFAULT: SettingSnapshotOut = {
  baseUrl: "Config.API_URL",
};
