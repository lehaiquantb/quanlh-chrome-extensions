import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { FigmaModel } from "./FigmaModel"
import { StackoverflowModel } from "./StackoverflowModel"
import { ERegexUrl } from "@/shared/constants"
import { $nonEmptyObject } from "mobx-state-tree/dist/internal"

export const ToolModel = types
  .model("ToolStoreModel")
  .props({
    matchRegexUrls: types.optional(types.array(types.string), [ERegexUrl.MATCH_ALL]),
  })
  .views((self) => ({
    get isSupported(): boolean {
      try {
        return self.matchRegexUrls?.some((url) => new RegExp(url).test(window.location.href))
      } catch (error) {
        return false
      }
    },

    // get util() {},
  }))
  .actions(withSetPropAction)
  .actions((self) => ({
    autoExecute: () => {
      // console.log("ToolModel autoExecute")
      if (self.isSupported) {
        // const toolInstance = self.execute()
      }
    },
  }))

export type Tool = Instance<typeof ToolModel>
export type ToolSnapshotOut = SnapshotOut<typeof ToolModel>
export type ToolSnapshotIn = SnapshotIn<typeof ToolModel>
export type ToolSnapshot = SnapshotOut<typeof ToolModel>

export const TOOL_MODEL_DEFAULT: ToolSnapshot = {
  matchRegexUrls: [ERegexUrl.MATCH_ALL],
}
