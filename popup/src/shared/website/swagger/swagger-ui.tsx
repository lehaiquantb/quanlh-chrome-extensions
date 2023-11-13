import React from "react"
import { UIManager } from "@/shared/components/UIManager"
import { SwaggerSideBarComponent } from "@/shared/components/swagger/SwaggerSideBar"
import { getGlobalVar } from "@/shared/helper.common"
import { StorageType } from "@/shared/services/storage"
import withStorage from "@/shared/withStorage"
import { SwaggerHeaderComponent } from "@/shared/components/swagger/SwaggerHeader"
import config from "@/shared/config"
import { camelCase } from "lodash"

// function whenAvailable(name: any, callback: any) {
//     const interval = 10; // ms
//     window.setTimeout(function () {
//         if (window[name]) {
//             callback(window[name]);
//         } else {
//             whenAvailable(name, callback);
//         }
//     }, interval);
// }

const ID_SIDE_BAR = "side-bar"
const ID_HEADER = "ql-sw-header"

export function querySelectorIncludesText(selector: string, text: string, parent = document) {
  try {
    return Array.from(parent?.querySelectorAll?.(selector))?.find((el) =>
      el?.textContent?.includes(text),
    )
  } catch (error) {
    return null
  }
}

export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div")
  div.innerHTML = htmlString.trim()

  return div.firstChild as HTMLElement
}

export function polling(callback: () => boolean, execute: () => void, maxRetry = 1000) {
  const interval = 100 // ms
  if (maxRetry <= 0) {
    return
  }
  const id = setTimeout(function () {
    if (callback()) {
      execute()
      id && clearTimeout(id)
    } else {
      polling(callback, execute, maxRetry - 1)
      id && clearTimeout(id)
    }
  }, interval)
}

export class GroupApi {
  id!: string
  name: string
  $el: HTMLSpanElement
  apiList: Api[] = []
  href: string

  get $inner(): HTMLDivElement {
    return this.$el.querySelector("div.opblock") as HTMLDivElement
  }

  constructor(opts: { $el: HTMLSpanElement }) {
    this.$el = opts.$el
    this.name = this.$el?.querySelector("h3")?.getAttribute("data-tag") ?? ""
    this.id = `group-${camelCase(this.name)}`
    this.$el.id = this.id

    this.apiList = Array.from(
      this.$el.querySelector("div.operation-tag-content")?.childNodes as any,
    )?.map(($el: any) => new Api({ $el, parent: this }))
    this.href = this.$el.querySelector("h3 a")?.getAttribute("href") ?? ""
  }
}

export class Api {
  id!: string
  description: string
  path: string
  method: string
  href: string
  $el: HTMLSpanElement
  parent: GroupApi
  $btnExpand: HTMLButtonElement

  get $responsesInner(): HTMLDivElement {
    return this.$el.querySelector("div.responses-inner") as HTMLDivElement
  }

  get $responsesTableExample(): HTMLTableElement {
    return this.$el.querySelector("table.responses-table[aria-live='polite']") as HTMLTableElement
  }

  get $responsesTableLive(): HTMLTableElement {
    return this.$el.querySelector("table.responses-table.live-responses-table") as HTMLTableElement
  }

  get $responseHeaders(): HTMLDivElement {
    return querySelectorIncludesText("h5", "Response headers", this.$responsesTableLive as any)
      ?.parentElement as HTMLDivElement
  }

  get isExpanded(): boolean {
    return this.$btnExpand.getAttribute("aria-expanded") === "true"
  }

  constructor(opts: { $el: HTMLSpanElement; parent: GroupApi }) {
    this.$el = opts.$el
    this.parent = opts.parent
    this.method = this.$el?.querySelector(".opblock-summary-method")?.textContent ?? ""
    this.path = this.$el?.querySelector(".opblock-summary-path")?.getAttribute("data-path") ?? ""
    this.description = this.$el?.querySelector(".opblock-summary-description")?.textContent ?? ""
    this.href = this.$el?.querySelector(".opblock-summary-path a")?.getAttribute("href") ?? ""
    this.$btnExpand = this.$el.querySelector("button.opblock-control-arrow") as any
    this.id = `api-${camelCase(this.method)}-${camelCase(this.path)}`
    this.$el.id = this.id
    // if (this.parent?.$inner) {
    //   new MutationObserver((mutations) => {
    //     mutations.forEach((mutation) => {
    //       if (mutation.type === "childList") {
    //         polling(
    //           () => !!this.$responsesInner,
    //           () => {
    //           },
    //         )
    //       }
    //     })
    //   }).observe(this.parent.$inner, {
    //     childList: true,
    //   })
    // }
    this.handleHiddenResponseExample()
  }

  handleHiddenResponseExample() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          if (this.isExpanded) {
            this.handleChangeChildList()

            polling(
              () => !!this.$responsesTableExample?.style,
              () => {
                this.$responsesTableExample.style.display = "none"
              },
            )
          }
        }
      })
    })
    observer.observe(this.$btnExpand, {
      attributes: true,
    })
  }

  hideResponseHeader() {
    if (this.$responseHeaders?.style) {
      this.$responseHeaders.style.display = "none"
    }
  }

  handleChangeChildList() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (this.isExpanded) {
            polling(
              () => !!this.$responseHeaders?.style,
              () => {
                this.$responseHeaders.style.display = "none"
              },
            )
          }
        }
      })
    })
    if (this.$responsesInner) {
      // console.log("handleChangeChildList", this.$responsesInner)

      observer.observe(this.$responsesInner, {
        childList: true,
      })
    }
  }
}

export class SwaggerUIX {
  logger = {
    error: (...args: any[]) => {
      console.error("[SWAGGER] [ERROR]", args)
    },
    info: (...args: any[]) => {
      console.info("[SWAGGER] [INFO]", ...args)
    },
  }

  groupApiList: GroupApi[] = []
  $sideBar: HTMLDivElement = createElementFromHTML(
    `<div id="${ID_SIDE_BAR}" class="side-bar"></div>`,
  ) as HTMLDivElement

  $headerWrapper: HTMLDivElement = createElementFromHTML(
    `<div id="${ID_HEADER}"></div>`,
  ) as HTMLDivElement

  get $schemaContainer(): HTMLDivElement {
    return document.querySelector("div.scheme-container") as HTMLDivElement
  }

  get $topBar(): HTMLDivElement {
    return document.querySelector("div.topbar") as HTMLDivElement
  }

  get $informationContainerWrapper(): HTMLDivElement {
    return document.querySelector(".information-container.wrapper") as HTMLDivElement
  }

  get $mainWrapper(): HTMLDivElement {
    return this.$sectionWrapper.parentElement as HTMLDivElement
  }

  get $schemesWrapper() {
    return document.querySelector("section.schemes.wrapper") as HTMLDivElement
  }

  get $sectionWrapper(): HTMLDivElement {
    return document.querySelector("div.wrapper > section.block.block-desktop") as HTMLDivElement
  }

  get $models() {
    return document.querySelector("section.models") as HTMLDivElement
  }

  storageType: StorageType = "chromeStorage"

  // eslint-disable-next-line @typescript-eslint/no-empty-function, no-useless-constructor
  constructor(opts?: { initOnPageLoaded?: boolean; storageType?: StorageType }) {
    const { initOnPageLoaded = false, storageType = "chromeStorage" } = opts ?? {}
    this.storageType = storageType
    if (initOnPageLoaded) {
      document.addEventListener("DOMContentLoaded", () => {
        this.initUI()
      })
    }
  }

  initUI() {
    setTimeout(() => {
      this.onPageLoaded()
    }, 500)
  }

  onPageLoaded() {
    this.hideUINotNeeded()
    const els = Array.from(this.$sectionWrapper?.firstChild?.childNodes as any)
    els?.forEach(($el: any) => {
      this.groupApiList.push(new GroupApi({ $el }))
    })

    this.changeLayout()
    document.addEventListener("change", (e) => {
      this.groupApiList.forEach((groupApi) => {
        groupApi.apiList.forEach((api) => {
          api?.hideResponseHeader()
        })
      })
    })
  }

  changeLayout() {
    this.$schemesWrapper.prepend(this.$headerWrapper)
    this.$mainWrapper.prepend(this.$sideBar)
    this.$mainWrapper.style.display = "flex"
    this.$mainWrapper.style.flexDirection = "row"
    this.$mainWrapper.style.maxWidth = `${window.screen.width}px`
    this.$sideBar.style.width = `70rem`
    this.$sectionWrapper.style.width = `100rem`
    this.$sectionWrapper.style.overflow = `auto`
    this.$sectionWrapper.style.maxHeight = `60rem`
    const SwaggerSideBar = withStorage(SwaggerSideBarComponent, { storageType: this.storageType })
    const SwaggerHeader = withStorage(SwaggerHeaderComponent, { storageType: this.storageType })

    UIManager.render({ Component: <SwaggerSideBar swaggerUI={this} />, id: ID_SIDE_BAR })
    UIManager.render({ Component: <SwaggerHeader swaggerUI={this} />, id: ID_HEADER })
  }

  hideUINotNeeded() {
    // hide top bar
    this.$topBar.style.display = "none"
    this.$informationContainerWrapper.style.display = "none"
    this.$schemaContainer.style.padding = `10px 0`
    this.$models.style.display = "none"
  }

  async login(email?: string, password?: string) {
    const callLogin = async (data: any) => {
      return new Promise((resolve, reject) => {
        fetch(`${location.origin}/api/v1/auth/login`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
          method: "POST",
          mode: "cors",
        })
          .then((res) => res.json())
          .then((data) => {
            resolve(data)
          })
          .catch((err) => {
            this.logger.error(err)
          })
      })
    }

    function clickAuthBtn() {
      const authButton = document.querySelector(
        ".auth-btn-wrapper .modal-btn.auth",
      ) as HTMLButtonElement
      if (authButton) {
        authButton?.click()
      }
    }

    ;(async () => {
      const payload = {
        provider: "email",
        email: email ?? config.cr.username,
        password: password ?? config.cr.password,
      }

      const res = (await callLogin(payload)) as any
      this.logger.info(`${res?.data?.accessToken?.token}`)
      const jwtToken = res.data.accessToken.token

      setTimeout(function () {
        const openAuthFormLockButton = document.querySelector(
          ".auth-wrapper .authorize.locked",
        ) as HTMLButtonElement
        if (openAuthFormLockButton) {
          openAuthFormLockButton?.click()
          clickAuthBtn()
        } else {
          const openAuthFormUnlockButton = document.querySelector(
            ".auth-wrapper .authorize.unlocked",
          ) as HTMLButtonElement
          openAuthFormUnlockButton?.click()
        }

        const tokenInput = document.querySelector(".auth-container input") as HTMLInputElement

        const closeButton = document.querySelector("button.btn-done") as HTMLButtonElement

        const nativeInputValueSetter = (Object as any).getOwnPropertyDescriptor(
          window?.HTMLInputElement?.prototype,
          "value",
        ).set as any
        nativeInputValueSetter.call(tokenInput, jwtToken)

        const inputEvent = new Event("input", { bubbles: true })
        tokenInput.dispatchEvent(inputEvent)
        clickAuthBtn()
        closeButton.click()
      }, 400)
    })()
  }
}
