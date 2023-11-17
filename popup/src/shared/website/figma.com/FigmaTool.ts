import { WebsiteTool } from "../common.website"

export class FigmaTool extends WebsiteTool {
  toolKey: TKeyTool = "figmaTool"
  autoExecute: () => void | Promise<void> = () => {
    console.log("FigmaTool autoExecute")
  }
}

export const figmaTool = new FigmaTool()
