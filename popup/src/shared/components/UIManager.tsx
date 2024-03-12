import React, { ReactNode } from "react"
import ReactDOM from "react-dom/client"

type RenderOption = {
  id?: string
  htmlElement?: HTMLElement
  Component: ReactNode
}

export class UIManager {
  static render(opts: RenderOption) {
    const { id, Component, htmlElement } = opts
    const root = ReactDOM.createRoot(htmlElement ?? (document.getElementById(id || 'body') as HTMLElement))
    root.render(<React.StrictMode>{Component}</React.StrictMode>)
  }
}
