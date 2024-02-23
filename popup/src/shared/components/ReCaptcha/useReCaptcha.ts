import { useCallback, useEffect } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export type ReCaptchaOptions = {
  visible?: boolean
}

export const useReCaptcha = (opts?: ReCaptchaOptions) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { visible = true } = opts ?? {}

  const getReCaptchaToken = useCallback(
    async (action: string) => {
      console.log("executeRecaptcha", executeRecaptcha)

      if (!executeRecaptcha) {
        return null
      }

      const token = await executeRecaptcha(action)
      return token
    },
    [executeRecaptcha],
  )

  useEffect(() => {
    const grecaptchaBadgeElement = document.querySelector(".grecaptcha-badge") as HTMLDivElement

    if (grecaptchaBadgeElement?.style && visible) {
      grecaptchaBadgeElement.style.visibility = "visible"
    }

    return () => {
      if (grecaptchaBadgeElement?.style) {
        grecaptchaBadgeElement.style.visibility = "hidden"
      }
    }
  }, [executeRecaptcha])

  return {
    getReCaptchaToken,
  }
}
