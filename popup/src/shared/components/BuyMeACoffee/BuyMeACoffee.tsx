import { imageViewerManager } from "@/tools/ImageViewerManager"
import React, { useEffect, useState } from "react"

export const BuyMeACoffee = () => {
  const [buyMeACoffeeUrl, setBuyMeACoffeeUrl] = useState<string>("")
  useEffect(() => {
    ;(async () => {
      const _buyMeACoffeeUrl = await imageViewerManager.getUrl("buymeacoffee.png")
      setBuyMeACoffeeUrl(_buyMeACoffeeUrl)
    })()
  })

  return (
    <div>
      <img src={buyMeACoffeeUrl} alt="" />
    </div>
  )
}
