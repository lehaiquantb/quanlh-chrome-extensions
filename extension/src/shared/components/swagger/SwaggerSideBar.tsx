import { useInitialRootStore, useStores } from "@/shared/models"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom/client"
import { UIManager } from "../UIManager"
import withStorage from "@/shared/withStorage"
import { Api, GroupApi, SwaggerUIX } from "@/shared/website/swagger/swagger-ui"
import { Collapse, CollapseProps } from "antd"

type Props = {
  swaggerUI: SwaggerUIX
}

export const SwaggerSideBarComponent: FC<Props> = observer((props: Props) => {
  const { swaggerUI } = props
  const {
    website: {
      swaggerTool: { autoExecute, autoInitUI },
    },
  } = useStores()
  // const {
  //   setting: {},
  // } = figmaTool

  useEffect(() => {
    autoExecute()
    console.log("autoInitUI", autoInitUI)
  }, [autoInitUI])

  const items = useMemo(() => {
    return swaggerUI.groupApiList.map((groupApi) => ({
      key: groupApi.name,
      label: groupApi.name,
      children: <GroupApiComponent groupApi={groupApi} />,
      extra: (
        <div
          onClick={(e) => {
            groupApi.$el.scrollIntoView(true)
          }}
        >
          Go
        </div>
      ),
    })) as CollapseProps["items"]
  }, [swaggerUI])

  return (
    <div>
      <h1>Hello - {autoInitUI ? "true" : "false"}</h1>
      <Collapse items={items} bordered={false} defaultActiveKey={["1"]} />
    </div>
  )
})

export const ApiComponent = observer((props: { api: Api }) => {
  const { api } = props
  const { description, path, method, href } = api
  return (
    <div>
      <div>{path}</div>
      {/* <div>{description}</div>
      <div>{method}</div>
      <div>{href}</div> */}
    </div>
  )
})

export const GroupApiComponent = observer((props: { groupApi: GroupApi }) => {
  const { groupApi } = props
  const { name, apiList } = groupApi
  return (
    <div>
      {apiList.map((api, index) => (
        <ApiComponent key={`${api.method}-${api.path}-${index}`} api={api} />
      ))}
    </div>
  )
})

SwaggerSideBarComponent.defaultProps = {}

export default withStorage(SwaggerSideBarComponent)
