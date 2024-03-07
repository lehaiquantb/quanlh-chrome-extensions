import { useStores } from "@/shared/models"
import { Input, Switch } from "antd"
import { observer } from "mobx-react-lite"
import React from "react"

export const Otp = observer(() => {
  const {
    website: { swaggerTool },
  } = useStores()

  const { otpCode, loginWithOtp, setProp } = swaggerTool

  const onChange = (e: any) => {
    setProp("otpCode", `${e.target.value}` as string)
  }

  return (
    <div
      style={{
        backgroundColor: "gray",
        padding: "3px",
        borderRadius: "3px",
        marginLeft: "1rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Switch
        // checkedChildren="on"
        // unCheckedChildren="off"
        defaultChecked={false}
        checked={loginWithOtp}
        onChange={() => setProp("loginWithOtp", !loginWithOtp)}
      />
      <Input
        style={{ marginLeft: "3px", width: "4rem" }}
        placeholder="Otp"
        min={1}
        max={10}
        defaultValue={3}
        value={otpCode}
        onChange={onChange}
      />
    </div>
  )
})
