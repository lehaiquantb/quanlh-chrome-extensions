import { useInitialRootStore, useStores } from "@/shared/models"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom/client"
import { UIManager } from "../UIManager"
import withStorage from "@/shared/withStorage"
import { Api, GroupApi, SwaggerUIX } from "@/shared/website/swagger/swagger-ui"
import { Collapse, CollapseProps } from "antd"
import { ButtonCopyToClipboard } from "../common/ButtonCopyToClipboard/ButtonCopyToClipboard"

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
      style: {
        fontWeight: "bolder",
      },
    })) as CollapseProps["items"]
  }, [swaggerUI])

  return (
    <div>
      <ButtonCopyToClipboard />
      <h1>APIs</h1>
      <Collapse items={items} bordered={false} defaultActiveKey={["1"]} />
    </div>
  )
})

export const MAP_METHOD_COLOR = {
  POST: "#49cc90",
  GET: "#61affe",
  PUT: "#faad14",
  DELETE: "#f93e3e",
  PATCH: "#50e3c2",
}

export const MAP_METHOD_BACKGROUND = {
  GET: "rgba(97,175,254,.1)",
  POST: "rgba(73,204,144,.1)",
  PUT: "#faad14",
  DELETE: "rgba(249,62,62,.1)",
  PATCH: "rgba(80,227,194,.1)",
}

export const ApiComponent = observer((props: { api: Api }) => {
  const { api } = props
  const { description, path, method, href, shortPath } = api
  useEffect(() => {
    setTimeout(() => {
      api.onChangeExpanded((expanded) => {
        console.log("expanded", expanded)
      })
    }, 2000)
  }, [])
  return (
    <div
      style={{
        marginTop: 2,
        padding: 3,
        backgroundColor: MAP_METHOD_COLOR?.[method],
        borderRadius: 3,
        borderColor: MAP_METHOD_COLOR?.[method],
        borderWidth: 1,
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      onClick={(e) => {
        api.$el.scrollIntoView(true)
      }}
    >
      <div
        style={{
          padding: 3,
          fontWeight: "bold",
          borderRadius: 3,
          width: 50,
          fontSize: 12,
        }}
      >
        {method}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: 11,
        }}
      >
        {shortPath}
      </div>
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
    <div
      style={{
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      {apiList.map((api, index) => (
        <ApiComponent key={`${api.method}-${api.path}-${index}`} api={api} />
      ))}
    </div>
  )
})

SwaggerSideBarComponent.defaultProps = {}

export default withStorage(SwaggerSideBarComponent)
