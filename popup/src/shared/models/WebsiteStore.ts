import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { TOOL_MODEL_DEFAULT, ToolModel } from "./ToolModel"
export const WebsiteStoreModel = types
  .model("WebsiteStoreModel")
  .props({
    figmaTool: types.optional(ToolModel, TOOL_MODEL_DEFAULT),
    stackoverflowTool: types.optional(ToolModel, TOOL_MODEL_DEFAULT),
  })
  .views((self) => ({
    get ll() {
      return "a"
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => ({}))

export type Website = Instance<typeof WebsiteStoreModel>
export type WebsiteSnapshotOut = SnapshotOut<typeof WebsiteStoreModel>
export type WebsiteSnapshotIn = SnapshotIn<typeof WebsiteStoreModel>
export type WebsiteSnapshot = SnapshotOut<typeof WebsiteStoreModel>
export const WEBSITE_STORE_DEFAULT: WebsiteSnapshotOut = {
  figmaTool: TOOL_MODEL_DEFAULT,
  stackoverflowTool: TOOL_MODEL_DEFAULT,
}
