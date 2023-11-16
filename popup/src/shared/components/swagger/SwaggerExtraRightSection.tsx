import { copyToClipboard } from "@/shared/helper.common"
import { useStores } from "@/shared/models"
import { SwaggerUIX } from "@/shared/website/swagger/swagger-ui"
import withStorage from "@/shared/withStorage"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import ReactJson from "react-json-view"
type Props = {
  swaggerUI: SwaggerUIX
}

export const SwaggerExtraRightSectionComponent: FC<Props> = observer((props: Props) => {
  const { swaggerUI } = props
  const [json, setJson] = useState({})
  const {
    website: {
      swaggerTool: { autoExecute },
    },
  } = useStores()

  useEffect(() => {
    swaggerUI.onResponse((res) => {
      const body = res?.body
      if (typeof body === "object") {
        setJson(body)
      } else if (typeof body === "string") {
        setJson({ value: body })
      }
    })
  }, [])

  return (
    <div>
      <ReactJson
        src={json}
        displayDataTypes={false}
        enableClipboard={(copy) => {
          const { name, namespace, src } = copy
          if (typeof src === "string") {
            copyToClipboard(src)
          } else {
            copyToClipboard(JSON.stringify(src))
          }
        }}
      />
    </div>
  )
})

SwaggerExtraRightSectionComponent.defaultProps = {}

export default withStorage(SwaggerExtraRightSectionComponent)
