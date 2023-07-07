import { _rootStore } from "../models"

export abstract class WebsiteTool {
  abstract toolKey: TKeyTool
  abstract autoExecute: () => void | Promise<void>
  get model() {
    return _rootStore?.website?.[this.toolKey]
  }
}
