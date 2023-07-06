import React, { ReactNode } from "react"
import ReactDOM from "react-dom/client"

type RenderOption = {
  id: string
  Component: ReactNode
}

export class UI {
  static render(opts: RenderOption) {
    const { id, Component } = opts
    const root = ReactDOM.createRoot(document.getElementById(id) as HTMLElement)
    root.render(<React.StrictMode>{Component}</React.StrictMode>)
  }
}
