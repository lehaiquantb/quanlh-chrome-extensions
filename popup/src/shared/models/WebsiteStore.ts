import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { FIGMA_MODEL_DEFAULT, FigmaModel } from "./website/FigmaModel"
import { STACKOVERFLOW_MODEL_DEFAULT, StackoverflowModel } from "./website/StackoverflowModel"
import { SWAGGER_MODEL_DEFAULT, SwaggerModel } from "./website/SwaggerModel"

export const WebsiteStoreModel = types
  .model("WebsiteStoreModel")
  .props({
    figmaTool: types.optional(FigmaModel, FIGMA_MODEL_DEFAULT),
    stackoverflowTool: types.optional(StackoverflowModel, STACKOVERFLOW_MODEL_DEFAULT),
    swaggerTool: types.optional(SwaggerModel, SWAGGER_MODEL_DEFAULT),
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
  figmaTool: FIGMA_MODEL_DEFAULT,
  stackoverflowTool: STACKOVERFLOW_MODEL_DEFAULT,
  swaggerTool: SWAGGER_MODEL_DEFAULT,
}
