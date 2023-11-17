import { WebsiteTool } from "../common.website"

export class StackoverflowTool extends WebsiteTool {
  toolKey: TKeyTool = "stackoverflowTool"
  autoExecute: () => void | Promise<void> = () => {
    console.log("StackoverflowTool autoExecute")
  }
}

export const stackoverflowTool = new StackoverflowTool()
