import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ToolModel } from "./ToolModel"
import { ERegexUrl } from "@/shared/constants"

export const FigmaModel = types
  .compose(
    ToolModel,
    types.model({
      isHighlightTag: types.optional(types.boolean, true),
    }),
  )
  .named("FigmaModel")
  .views((self) => ({}))
  .actions(withSetPropAction)
  .actions((self) => ({
    // autoExecute: () => {
    //   console.log("FigmaModel autoExecute")
    // },
  }))

export type FigmaInstance = Instance<typeof FigmaModel>
export type FigmaSnapshotOut = SnapshotOut<typeof FigmaModel>
export type FigmaSnapshotIn = SnapshotIn<typeof FigmaModel>
export type FigmaSnapshot = SnapshotOut<typeof FigmaModel>

export const FIGMA_MODEL_DEFAULT: FigmaSnapshot = {
  isHighlightTag: true,
  matchRegexUrls: [ERegexUrl.FIGMA],
}
