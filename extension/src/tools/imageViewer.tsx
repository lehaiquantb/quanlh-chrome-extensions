import React from "react"
import { ImageViewer } from "@/shared/components/ImageViewer/ImageViewer"
import { UIManager } from "@/shared/components/UIManager"
import withStorage from "@/shared/withStorage"

export class ImageViewerManager {
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}

  findImageElements() {
    return Array.from(document?.querySelectorAll?.("img") ?? [])
  }

  execute() {
    const imgs = this.findImageElements()
  }

  renderViewerWithImageElement(img: HTMLImageElement) {
    const divElement = document.createElement("div")
    const ImageViewerCom = withStorage(ImageViewer, {
      storageType: "localStorage",
    })
    divElement.appendChild(img)
    UIManager.render({
      htmlElement: divElement,
      Component: <ImageViewerCom />,
    })
  }
}

export const imageViewerManager = new ImageViewerManager()
