import React, { useEffect, useRef, useState } from "react"
import { Image } from "antd"
import type { ImagePreviewType } from "rc-image/lib/Image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoffee } from "@fortawesome/free-solid-svg-icons"

type Props = {
  imgElement: HTMLImageElement
}

export const ImageViewer = (props: Props) => {
  const { imgElement } = props
  const [preview, setPreview] = useState<ImagePreviewType>()
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    divRef.current?.appendChild(imgElement)
  }, [])

  return (
    <div ref={divRef}>
      <div>
        <FontAwesomeIcon icon={faCoffee} />
      </div>
      <Image
        preview={preview}
        width={100}
        height={100}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    </div>
  )
}
