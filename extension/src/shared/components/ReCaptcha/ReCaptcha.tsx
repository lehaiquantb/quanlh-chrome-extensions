import React, { createRef, useImperativeHandle } from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { useReCaptcha } from "./useReCaptcha"
import { observer } from "mobx-react-lite"
import { Input } from "antd"
import { useStores } from "@/shared/models"

export const reCaptchaRef = createRef<any>()

const ReCaptchaChild = observer(() => {
  const { getReCaptchaToken } = useReCaptcha()
  //   useEffect(() => {
  //     ;(async () => {
  //       const t = await getReCaptchaToken("homepage")
  //       console.log(t)
  //     })()
  //   }, [getReCaptchaToken])

  const {
    website: { swaggerTool },
  } = useStores()

  const { setProp, recaptchaSiteKey } = swaggerTool

  useImperativeHandle(
    reCaptchaRef,
    () => {
      return {
        getReCaptchaToken,
      }
    },
    [getReCaptchaToken],
  )

  const onSetSiteKey = (e: any) => {
    setProp("recaptchaSiteKey", e?.target?.value)
  }

  return (
    <div style={{ marginLeft: "5rem" }}>
      <Input
        placeholder="ReCaptcha Site Key"
        width={"30rem"}
        style={{ width: "30rem" }}
        defaultValue={"xxx"}
        onChange={onSetSiteKey}
        value={recaptchaSiteKey}
      />
    </div>
  )
})

export const ReCaptcha = observer(() => {
  const {
    website: { swaggerTool },
  } = useStores()

  const { recaptchaSiteKey } = swaggerTool
  console.log("recaptchaSiteKey", recaptchaSiteKey)

  return (
    <GoogleReCaptchaProvider
      key={recaptchaSiteKey}
      reCaptchaKey={recaptchaSiteKey}
      container={{
        parameters: {
          errorCallback: function (e: any) {
            console.log("errorCallback RECAPTCHA", e)
          } as any,
        },
      }}
    >
      <ReCaptchaChild />
    </GoogleReCaptchaProvider>
  )
})
