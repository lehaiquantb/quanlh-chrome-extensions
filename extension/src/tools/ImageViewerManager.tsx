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
    return Array.from(document?.querySelectorAll?.("img") ?? [])?.filter(
      (i) =>
        i?.getAttribute("data-viewerable") !== "false" && !i?.className?.includes("ant-image-img"),
    )
  }

  execute() {
    const imgs = this.findImageElements()
    console.log("TOTAL IMAGES", imgs?.length)

    imgs?.forEach((img) => {
      this.renderViewerWithImageElement(img)
    })
  }

  renderViewerWithImageElement(img: HTMLImageElement) {
    try {
      const parent = document.createElement("div")
      const _img = img.cloneNode(true) as HTMLImageElement
      _img.setAttribute("data-viewerable", "false")
      img.replaceWith(parent)
      // const ImageViewerCom = withStorage(ImageViewer, {
      //   storageType: "localStorage",
      // })

      UIManager.render({
        htmlElement: parent,
        Component: <ImageViewer imgElement={_img} />,
      })
    } catch (error) {
      console.error(`renderViewerWithImageElement ${error}`)
    }
  }
}

export const imageViewerManager = new ImageViewerManager()
