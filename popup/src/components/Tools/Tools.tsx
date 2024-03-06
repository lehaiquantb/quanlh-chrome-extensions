import { ECommandId } from "@/shared";
import { Extension } from "@/utils/Extension";
import { Button, Input } from "antd";
import { useState } from "react";

export const Tools = () => {
  const [siteKey, setSiteKey] = useState("");
  const onGetToken = async () => {
    const { token } = await Extension.executeCommand({
      commandId: ECommandId.GET_RECAPTCHA_TOKEN,
      params: {
        action: "LOGIN",
        siteKey,
      },
    });
  };

  return (
    <div>
      <Input
        value={siteKey}
        onChange={(e) => setSiteKey(e.target.value)}
        addonBefore="DEV"
        placeholder="Site Key"
        addonAfter={<Button onClick={onGetToken}>GET</Button>}
      />
    </div>
  );
};
