import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ToolModel } from "./ToolModel"
import { ERegexUrl } from "@/shared/constants"

export const StackoverflowModel = types
  .compose(
    ToolModel,
    types
      .model({})
      .views((self) => ({}))
      .actions(withSetPropAction)
      .actions((self) => ({})),
  )
  .named("StackoverflowStoreModel")
  .views((self) => ({}))
  .actions(withSetPropAction)
  .actions((self) => ({}))

export type StackoverflowInstance = Instance<typeof StackoverflowModel>
export type StackoverflowSnapshotOut = SnapshotOut<typeof StackoverflowModel>
export type StackoverflowSnapshotIn = SnapshotIn<typeof StackoverflowModel>
export type StackoverflowSnapshot = SnapshotOut<typeof StackoverflowModel>

export const STACKOVERFLOW_MODEL_DEFAULT: StackoverflowSnapshot = {
  matchRegexUrls: [ERegexUrl.STACKOVERFLOW],
}
