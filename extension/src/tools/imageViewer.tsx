import React from "react"
import { ImageViewer } from "@/shared/components/ImageViewer/ImageViewer"
import { UIManager } from "@/shared/components/UIManager"
import withStorage from "@/shared/withStorage"
import { storageLocal } from "@/shared"
import { QUANLH_CHROME_RUNTIME_ID } from "@/constants"

export class ImageViewerManager {
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}

  async getUrl(path: string) {
    const runtimeId = (await storageLocal.get(QUANLH_CHROME_RUNTIME_ID)) as string
    return `chrome-extension://${runtimeId}/assets/images/images/${path}`
  }

  findImageElements() {
    return Array.from(document?.querySelectorAll?.("img") ?? [])
  }

  execute() {
    const imgs = this.findImageElements()
  }

  renderViewerWithImageElement(img: HTMLImageElement) {
    const parent = document.createElement("div")
    const _img = img.cloneNode(true) as HTMLImageElement

    img.replaceWith(parent)
    const ImageViewerCom = withStorage(ImageViewer, {
      storageType: "localStorage",
    })

    UIManager.render({
      htmlElement: parent,
      Component: <ImageViewerCom imgElement={_img} />,
    })
  }
}

export const imageViewerManager = new ImageViewerManager()
