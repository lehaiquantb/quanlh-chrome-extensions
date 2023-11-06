import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ToolModel } from "./ToolModel"
import { ERegexUrl } from "@/shared/constants"

export const SwaggerModel = types
  .compose(
    ToolModel,
    types.model({
      autoInitUI: types.optional(types.boolean, true),
    }),
  )
  .named("SwaggerModel")
  .views((self) => ({}))
  .actions(withSetPropAction)
  .actions((self) => ({
    setAutoInitUI: (value: boolean) => {
      self.autoInitUI = value
    },
    autoExecute: () => {
      console.log("SwaggerModel autoExecute")
    },
  }))

export type SwaggerInstance = Instance<typeof SwaggerModel>
export type SwaggerSnapshotOut = SnapshotOut<typeof SwaggerModel>
export type SwaggerSnapshotIn = SnapshotIn<typeof SwaggerModel>
export type SwaggerSnapshot = SnapshotOut<typeof SwaggerModel>

export const SWAGGER_MODEL_DEFAULT: SwaggerSnapshot = {
  autoInitUI: false,
  matchRegexUrls: [ERegexUrl.FIGMA],
}
