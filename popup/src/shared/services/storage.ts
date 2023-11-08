import { chrome } from "@/shared"

export type StorageType = "localStorage" | "chromeStorage"
export class Storage {
  type: StorageType = "chromeStorage"
  constructor(type: StorageType = "chromeStorage") {
    this.type = type
  }

  async set(key: string, value: any) {
    try {
      switch (this.type) {
        case "localStorage":
          localStorage.setItem(key, value)
          break
        case "chromeStorage":
          chrome?.storage?.local?.set?.({ [key]: value })
          break
      }
    } catch (error) {
      console.log("error set", error)
    }
  }

  async get(key: string) {
    try {
      switch (this.type) {
        case "localStorage":
          return localStorage.getItem(key)
        case "chromeStorage":
          return (await chrome?.storage?.local?.get?.(key))?.[key]
      }
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

export const storageChrome = new Storage("chromeStorage")
export const storageLocal = new Storage('localStorage')

