import config from "@/shared/config"
import { useStores } from "@/shared/models"
import { SwaggerUIX } from "@/shared/website/swagger/swagger-ui"
import withStorage from "@/shared/withStorage"
import { Button, Input, Space } from "antd"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Otp } from "../Otp/Otp"

type Props = {
  swaggerUI: SwaggerUIX
}

export const SwaggerHeaderComponent: FC<Props> = observer((props: Props) => {
  const { swaggerUI } = props

  const {
    website: {
      swaggerTool: { autoExecute, autoInitUI, email: _email, password: _password, setProp },
    },
  } = useStores()
  const [pass, setPass] = useState(_password)
  const [email, setEmail] = useState(_email)

  const onLogin = () => {
    swaggerUI.login(email, pass)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    setEmail(inputValue)
    setProp("email", inputValue)
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <Input placeholder="Email" value={email} onChange={onChange} />
        <Input
          placeholder="Password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value)
            setProp("password", e.target.value)
          }}
        />
        <Button type="primary" onClick={onLogin}>
          Login
        </Button>
      </div>
      <Otp />
    </div>
  )
})

SwaggerHeaderComponent.defaultProps = {}

export default withStorage(SwaggerHeaderComponent)
