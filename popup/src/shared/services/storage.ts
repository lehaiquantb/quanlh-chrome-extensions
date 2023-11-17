import { chrome, parseJson } from "@/shared"

export type StorageType = "localStorage" | "chromeStorage"
export class Storage {
  type: StorageType = "chromeStorage"
  constructor(type: StorageType = "chromeStorage") {
    this.type = type
    // switch (this.type) {
    //   case "localStorage":
    //     break
    //   case "chromeStorage":
    //     this.onChange()
    //     break
    // }
  }

  async set(key: string, value: any) {
    try {
      switch (this.type) {
        case "localStorage":
          // eslint-disable-next-line no-case-declarations
          const oldValue = (parseJson(localStorage) as any)?.[key]
          localStorage.setItem(key, value)
          // eslint-disable-next-line no-case-declarations
          const event = new CustomEvent("itemInserted", {
            detail: {
              oldValue,
              newValue: value,
              key,
            },
          }) as any

          document.dispatchEvent(event)
          break
        case "chromeStorage":
          await chrome?.storage?.local?.set?.({ [key]: value })
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

  onChange(cb: (changes: any) => void) {
    switch (this.type) {
      case "localStorage":
        document.addEventListener(
          "itemInserted",
          (event: any) => {
            const { key, oldValue, newValue } = event?.detail ?? {}
            // eslint-disable-next-line node/no-callback-literal
            cb?.({
              [key]: {
                oldValue,
                newValue,
              },
            })
          },
          false,
        )
        break
      case "chromeStorage":
        chrome?.storage?.onChanged?.addListener?.((changes, namespace) => {
          // console.log("changes", changes, namespace)
          if (namespace === "local") {
            cb?.(changes)
          }
        })
    }
  }

  async clear() {
    switch (this.type) {
      case "localStorage":
        localStorage.clear()
        break
      case "chromeStorage":
        await chrome?.storage?.local?.clear?.()
        break
    }
  }
}

export const storageChrome = new Storage("chromeStorage")
export const storageLocal = new Storage("localStorage")
