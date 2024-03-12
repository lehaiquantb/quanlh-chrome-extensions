import React, { useState } from "react"
import { Image } from "antd"
import type { ImagePreviewType } from "rc-image/lib/Image"

export const ImageViewer = () => {
  const [preview, setPreview] = useState<ImagePreviewType>()
  return (
    <div>
      <Image
        preview={preview}
        width={20}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    </div>
  )
}
