import { faEye } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Image } from "antd"
import type { ImagePreviewType } from "rc-image/lib/Image"
import React, { useEffect, useRef, useState, MouseEvent } from "react"

type Props = {
  imgElement: HTMLImageElement
}

export const ImageViewer = (props: Props) => {
  const { imgElement } = props
  const [preview, setPreview] = useState<ImagePreviewType>({
    visible: false,
    src: imgElement.src,
    scaleStep: 0.2,
    onVisibleChange: (value) => {
      setPreview({ ...preview, visible: value })
    },
  })
  const divRef = useRef<HTMLDivElement>(null)
  const [showIcon, setShowIcon] = useState(false)

  useEffect(() => {
    divRef.current?.appendChild(imgElement)
  }, [])

  const onMouseOver = () => {
    setShowIcon(true)
  }

  const onMouseLeave = () => {
    setShowIcon(false)
  }

  const onShow = (e: MouseEvent<HTMLDivElement>) => {
    setPreview({
      ...preview,
      visible: true,
    })
    e?.preventDefault()
    e?.stopPropagation()
  }

  return (
    <div
      className="quanlh-preview-container"
      ref={divRef}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          position: "absolute",
          zIndex: "1000",
          bottom: "15px",
          right: "10px",
          visibility: showIcon ? "visible" : "hidden",
          padding: "3px",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={onShow}
      >
        <div></div>
        <FontAwesomeIcon icon={faEye} color="white" />
      </div>
      <Image style={{ display: "none" }} preview={preview} width={0} height={0} />
    </div>
  )
}
