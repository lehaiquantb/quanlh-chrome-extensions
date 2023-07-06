import { useInitialRootStore, useStores } from "@/shared/models"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { UI } from "../App"
// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {}

const TailwindClassField: FC<Props> = (props: Props) => {
  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.
    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
  })
  const [t, setT] = useState("TailwindClassField")
  useEffect(() => {
    setInterval(() => {
      setT((t) => t + "1")
    }, 1000)
  }, [])

  if (!rehydrated) {
    return null
  }

  return (
    <div>
      {t}
      <div>
        <M />
      </div>
    </div>
  )
}

export const M = observer(() => {
  const { startAt } = useStores()
  return <div>{startAt}</div>
})

TailwindClassField.defaultProps = {}

export default TailwindClassField

export const render = () => {
  UI.render({ Component: <TailwindClassField />, id: "readme" })
}
