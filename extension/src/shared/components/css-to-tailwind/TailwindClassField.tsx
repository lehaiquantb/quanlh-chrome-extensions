import { useInitialRootStore, useStores } from "@/shared/models"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { UIManager } from "../UIManager"
import withStorage from "@/shared/withStorage"

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {}

const TailwindClassField: FC<Props> = (props: Props) => {
  const [t, setT] = useState("TailwindClassField")
  const {
    website: {
      figmaTool: { autoExecute },
    },
  } = useStores()
  // const {
  //   setting: {},
  // } = figmaTool

  useEffect(() => {
    autoExecute()
    setInterval(() => {
      setT((t) => t + "1")
    }, 1000)
  }, [])

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
const X = withStorage(TailwindClassField)
export const render = () => {
  UIManager.render({ Component: <X />, id: "readme" })
}
