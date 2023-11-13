/* eslint-disable no-eval */
export const createElementByText = (textHTML = "") => {
  const template = document.createElement("template")
  textHTML = textHTML.trim() // Never return a text node of whitespace as the result
  template.innerHTML = textHTML
  return template.content.firstElementChild as HTMLElement
}

export function copyToClipboard(text: string): boolean {
  try {
    const elem = document.createElement("textarea")
    elem.value = text
    document.body.appendChild(elem)
    elem.select()
    document.execCommand("copy")
    document.body.removeChild(elem)
    return true
  } catch (error) {
    return false
  }
}

export const isEmptyString = (str: string) => {
  return str === "" || str === null || str === undefined
}

export function globalVarIsExist(varName: string) {
  try {
    return !!(window as any)?.[varName] ?? eval(`typeof ${varName}`) !== "undefined"
  } catch (error) {
    // console.log('varIsExist', error);
    return false
  }
}

export function getGlobalVar<T = any>(varName: string): T | undefined {
  try {
    return globalVarIsExist(varName) ? (window as any)?.[varName] ?? eval(varName) : undefined
  } catch (error) {
    return undefined
  }
}

type Recursive<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key in keyof T]: T[key] extends Function ? T[key] : Recursive<T[key]>
}

type Chrome = Recursive<typeof chrome>

export function getChrome() {
  return getGlobalVar<Chrome>("chrome")
}

export async function getCurrentTab() {
  return (
    await getChrome()?.tabs?.query?.({
      active: true,
      currentWindow: true,
    })
  )?.[0]
}

export function tryEval(str: string, context?: Record<string, any>): any {
  try {
    const contextString = `
                const { ${Object.keys(context ?? {}).join(",")} } = context ?? {};
            `
    return eval(contextString + str)
  } catch (error) {
    console.error("tryEval =>", error)
    return undefined
  }
}

export function getRuntimeEnvironment() {
  const envs: string[] = []
  try {
    const chrome = getChrome()
    if (!chrome) {
      envs.push("browser")
    }
    if (typeof chrome?.extension !== "undefined") {
      console.log("Script đang chạy trong background.")
      envs.push("background")
    } else if (typeof chrome?.runtime !== "undefined") {
      console.log("Script đang chạy trong background hoặc event page.")
      envs.push("background_or_event_page")
    }

    const popupExists = (chrome?.extension as any)?.getViews?.({ type: "popup" })?.length > 0
    if (popupExists) {
      console.log("Script đang chạy trong popup.")
      envs.push("popup")
    }

    const isContentScript = window?.location?.href?.startsWith?.("http")
    const backgroundPageExists =
      typeof (chrome?.extension as any)?.getBackgroundPage?.() !== "undefined"

    if (isContentScript) {
      console.log("Script đang chạy trong content script.")
      envs.push("content_script")
    }
    if (backgroundPageExists) {
      console.log("Script đang chạy trong content script và background.")
      envs.push("content_script_and_background")
    }
    return envs
  } catch (error) {
    console.log("getRuntimeEnvironment", error)
    envs.push("unknown")
    return envs
  }
}

export const parseJson = (value: any) => {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch (error) {
    console.log("Error in parseJson", error)
    return undefined
  }
}

export const isMatchWebsite = (matchRegexUrls: string[]) => {
  return matchRegexUrls?.some((url) => new RegExp(url).test(window.location.href))
}
