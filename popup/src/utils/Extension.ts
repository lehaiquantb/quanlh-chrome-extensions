import { ECommandId, IMessage } from "../shared";
import { getChrome } from "./helper";

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

  static executeCommand(message: IMessage) {
    Extension.chrome?.tabs?.query?.(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        tabs?.[0]?.id &&
          Extension.chrome?.tabs?.sendMessage(tabs?.[0]?.id, message);
      }
    );
  }
}
