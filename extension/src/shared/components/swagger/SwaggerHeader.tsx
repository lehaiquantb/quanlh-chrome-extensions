import config from "@/shared/config"
import { useStores } from "@/shared/models"
import { SwaggerUIX } from "@/shared/website/swagger/swagger-ui"
import withStorage from "@/shared/withStorage"
import { Button, Input, Space } from "antd"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"

type Props = {
  swaggerUI: SwaggerUIX
}

export const SwaggerHeaderComponent: FC<Props> = observer((props: Props) => {
  const { swaggerUI } = props

  const {
    website: {
      swaggerTool: { autoExecute, autoInitUI, email: _email, password: _password },
    },
  } = useStores()
  const [pass, setPass] = useState(config.cr.password)
  const [email, setEmail] = useState(config.cr.username)

  const onLogin = () => {
    swaggerUI.login(email, pass)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    setEmail(inputValue)
  }

  return (
    <div>
      <div className="flex items-center">
        <Input placeholder="Email" value={email} onChange={onChange} />
        <Input
          placeholder="Password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value)
          }}
        />
        <Button type="primary" onClick={onLogin}>
          Login
        </Button>
      </div>
    </div>
  )
})

SwaggerHeaderComponent.defaultProps = {}

export default withStorage(SwaggerHeaderComponent)
