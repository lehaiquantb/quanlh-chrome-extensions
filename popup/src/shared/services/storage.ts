import { chrome } from "@/shared"

export class Storage {
  async set(key: string, value: any) {
    try {
      return chrome?.storage?.local?.set?.({ [key]: value })
    } catch (error) {
      console.log("error set", error)
    }
  }

  async get(key: string) {
    try {
      const res = await chrome?.storage?.local?.get?.(key)
      return res?.[key]
    } catch (error) {
      console.log("error get", error)
      return undefined
    }
  }

  onChange() {
    chrome?.storage?.onChanged?.addListener?.((changes, namespace) => {
      console.log("changes", changes, namespace)
    })
  }
}

export const storage = new Storage()
