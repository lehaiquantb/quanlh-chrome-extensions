import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ToolModel } from "./ToolModel"
import { ERegexUrl } from "@/shared/constants"
import config from "@/shared/config"

export const SwaggerModel = types
  .compose(
    ToolModel,
    types.model({
      autoInitUI: types.optional(types.boolean, config.cr.autoInitUI),
      email: types.optional(types.string, config.cr.username),
      password: types.optional(types.string, config.cr.password),
      recaptchaSiteKey: types.optional(types.string, config.cr.recaptchaSiteKey),
      loginWithOtp: types.optional(types.boolean, config.cr.loginWithOtp),
      otpCode: types.optional(types.string, ""),
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
  autoInitUI: config.cr.autoInitUI,
  matchRegexUrls: config.cr.matchRegexUrls,
  email: config.cr.username,
  password: config.cr.password,
  recaptchaSiteKey: config.cr.recaptchaSiteKey,
  loginWithOtp: config.cr.loginWithOtp,
  otpCode: "",
}
