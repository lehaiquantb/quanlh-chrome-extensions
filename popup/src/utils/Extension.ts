import { _rootStore } from "@/shared/models";
import { ECommandId, IMessage } from "../shared";
import { getChrome } from "./helper";
import { v4 as uuidv4} from "uuid";
export class Extension {
  static chrome = getChrome();

  static async getCurrentTab() {
    const tab = (
      await Extension.chrome?.tabs?.query?.({
        active: true,
        currentWindow: true,
      })
    )?.[0];
    return tab;
  }

  static executeCommand(message: IMessage): Promise<any> {
    _rootStore.setProp("nextEvent", {
      id: uuidv4(),
      type: message?.commandId,
      params: message?.params,
    });
    return new Promise<any>((resolve, reject) => {
      Extension.chrome?.tabs?.query?.(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          tabs?.[0]?.id &&
            Extension.chrome?.tabs?.sendMessage(
              tabs?.[0]?.id,
              message,
              (res) => {
                resolve(res);
              }
            );
        }
      );
    });
  }
}
