import { _rootStore } from "../models"
import { FigmaTool } from "./figma.com/FigmaTool"
import { StackoverflowTool } from "./stackoverflow.com/StackoverflowTool"

export abstract class WebsiteTool {
  abstract toolKey: TKeyTool
  abstract autoExecute: () => void | Promise<void>
  // get model() {
  //   return _rootStore?.website?.[this.toolKey]
  // }
}

export const WEBSITE_TOOL: { [key in TKeyTool]: WebsiteTool } = {
  figmaTool: new FigmaTool(),
  stackoverflowTool: new StackoverflowTool(),
}
