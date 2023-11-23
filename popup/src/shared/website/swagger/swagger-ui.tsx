import React from "react"
import { UIManager } from "@/shared/components/UIManager"
import { SwaggerSideBarComponent } from "@/shared/components/swagger/SwaggerSideBar"
import { getGlobalVar, injectReplaceCSS } from "@/shared/helper.common"
import { StorageType } from "@/shared/services/storage"
import withStorage from "@/shared/withStorage"
import { SwaggerHeaderComponent } from "@/shared/components/swagger/SwaggerHeader"
import config from "@/shared/config"
import { camelCase } from "lodash"
import {
  injectCopyToClipboard,
  injectCopyToClipboardField,
} from "@/shared/scripts/injectCopyToClipboard"
import SwaggerExtraRightSection, {
  SwaggerExtraRightSectionComponent,
} from "@/shared/components/swagger/SwaggerExtraRightSection"
import { notification } from "antd"
import { NotificationManager } from "@/shared/services/notification"

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
const ID_EXTRA_RIGHT = "extra-right"
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
  swaggerUI!: SwaggerUIX

  get $inner(): HTMLDivElement {
    return this.$el.querySelector("div.opblock") as HTMLDivElement
  }

  constructor(opts: { $el: HTMLSpanElement; swaggerUI: SwaggerUIX }) {
    this.$el = opts.$el
    this.swaggerUI = opts.swaggerUI
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
  swaggerUI!: SwaggerUIX

  get $responsesInner(): HTMLDivElement {
    return this.$el.querySelector("div.responses-inner") as HTMLDivElement
  }

  get $responsesTableExample(): HTMLTableElement {
    return this.$el.querySelector("table.responses-table[aria-live='polite']") as HTMLTableElement
  }

  get $responsesTableLive(): HTMLTableElement {
    return this.$el.querySelector("table.responses-table.live-responses-table") as HTMLTableElement
  }

  get $codePreResponse(): HTMLTableElement {
    return this.$responsesTableLive?.querySelector("pre code") as HTMLTableElement
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
    this.swaggerUI = opts.parent.swaggerUI
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

  generateCss() {
    return `
    #${this.id} .opblock-body table.parameters tbody {
      display: flex;
      flex-wrap: wrap;
      margin-top: 0px;
      width: 55rem;
      font-size: 14px;
    }
    #${this.id} .opblock-body table.parameters tbody tr {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-top: 0;
      min-width: 33%;
      border: 1px solid;
      border-radius: 8px;
      padding: 1px 9px;
      border-color: aliceblue;
    }
    #${this.id} .opblock-body table.parameters tbody tr .parameters-col_description {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      margin-bottom: 0.3rem;
    }
    #${this.id} .opblock-body table.parameters tbody div {
      font-size: 14px;
    }
    #${this.id} .opblock-body table.parameters thead {
      display: none;
    }
    #${this.id} .opblock-body table.parameters tbody tr .parameters-col_name {
      padding: 5px 0px;
    }
    #${this.id} .opblock-body table.parameters tbody tr .parameters-col_name .parameter__name {
      font-weight: bold;
    }
    #${this.id} .opblock-body table.parameters tbody tr .parameters-col_name .parameter__type {
      display: none;
    }
    #${this.id} .opblock-body table.parameters tbody tr .parameters-col_name .parameter__in {
      display: none;
    }
    #${this.id} .opblock-body table.parameters tbody tr .parameters-col_name .parameter__deprecated {
      display: none;
    }

    ${this.generateResponseTableCss()}
    `
  }

  generateResponseTableCss() {
    return `
      #${this.id} .responses-wrapper .responses-inner table.live-responses-table {
        display: none;
      }
    `
  }

  injectCopyToClipboardField() {
    const pre = this?.$responsesTableLive?.querySelector("pre") as HTMLPreElement
    if (pre) {
      injectCopyToClipboardField(pre, this.swaggerUI)
    }
  }

  handleHiddenResponseExample() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          if (this.isExpanded) {
            console.log("handleHiddenResponseExample")

            this.handleChangeResponseLive()
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

  handleChangeResponseLive() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (this.isExpanded) {
            console.log("handleChangeResponseLive")

            polling(
              () => !!this.$responseHeaders?.style,
              () => {
                this.$responseHeaders.style.display = "none"
              },
            )

            // polling(
            //   () => !!this.$codePreResponse?.style,
            //   () => {
            //     this.injectCopyToClipboardField()
            //     // this.handleChangeCodePre()
            //   },
            // )
          }
        }
      })
    })
    if (this.$responsesInner) {
      // this.injectCopyToClipboardField()
      console.log("handleChangeResponseLive", "success")
      observer.observe(this.$responsesInner, {
        childList: true,
      })
    }
  }

  handleChangeCodePre() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (this.isExpanded) {
            console.log("handleChangeCodePre")
            this.injectCopyToClipboardField()
          }
        }
      })
    })
    if (this.$codePreResponse) {
      // observer.observe(this.$codePreResponse, {
      //   childList: true,
      // })
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

  mouseEvent: MouseEvent | null = null
  groupApiList: GroupApi[] = []
  swaggerUIBundle: any
  $sideBar: HTMLDivElement = createElementFromHTML(
    `<div id="${ID_SIDE_BAR}" class="side-bar"></div>`,
  ) as HTMLDivElement

  $extraRight: HTMLDivElement = createElementFromHTML(
    `<div id="${ID_EXTRA_RIGHT}" class="${ID_EXTRA_RIGHT}"></div>`,
  ) as HTMLDivElement

  $headerWrapper: HTMLDivElement = createElementFromHTML(
    `<div id="${ID_HEADER}"></div>`,
  ) as HTMLDivElement

  get $swaggerContainer(): HTMLDivElement {
    return document.querySelector("#swagger-ui") as HTMLDivElement
  }

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
  constructor(opts?: {
    initOnPageLoaded?: boolean
    storageType?: StorageType
    swaggerUIBundle: any
  }) {
    this.swaggerUIBundle = opts?.swaggerUIBundle
    const { initOnPageLoaded = false, storageType = "chromeStorage" } = opts ?? {}
    this.storageType = storageType
    if (initOnPageLoaded) {
      document.addEventListener("DOMContentLoaded", () => {
        this.initUI()
      })
    }
    this.trackMouse()
    this.handleResponseInterceptor()
  }

  initUI() {
    setTimeout(() => {
      this.onPageLoaded()
    }, 500)
  }

  handleResponseInterceptor() {
    this.onResponse((response) => {
      setTimeout(() => {
        this.injectCopyToClipboardField()
      }, 1000)
    })
  }

  onResponse(cb: (r: any) => void) {
    if (this.swaggerUIBundle) {
      this.swaggerUIBundle.getConfigs().responseInterceptor = (response: any) => {
        cb(response)
      }
    }
  }

  onPageLoaded() {
    this.hideUINotNeeded()
    const els = Array.from(this.$sectionWrapper?.firstChild?.childNodes as any)
    els?.forEach(($el: any) => {
      this.groupApiList.push(new GroupApi({ $el, swaggerUI: this }))
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
    this.$mainWrapper.append(this.$extraRight)
    this.$extraRight.style.maxWidth = `40rem`
    this.$extraRight.style.minWidth = `40rem`

    this.$extraRight.style.overflowY = `auto`

    this.$mainWrapper.style.display = "flex"
    this.$mainWrapper.style.flexDirection = "row"
    this.$mainWrapper.style.maxWidth = `fit-content`
    this.$mainWrapper.style.padding = `0px 30px`
    this.$mainWrapper.style.height = `47rem`
    this.$mainWrapper.style.backgroundColor = `#eaeaea`

    this.$sideBar.style.width = `25rem`
    this.$sideBar.style.overflowY = `auto`
    this.$sideBar.style.marginRight = `3rem`
    this.$sectionWrapper.style.width = `100rem`
    this.$sectionWrapper.style.overflow = `auto`
    this.$sectionWrapper.style.maxHeight = `60rem`
    this.$swaggerContainer.style.maxHeight = `${window.innerHeight}px`
    this.$swaggerContainer.style.overflow = `hidden`

    const SwaggerSideBar = withStorage(SwaggerSideBarComponent, { storageType: this.storageType })
    const SwaggerHeader = withStorage(SwaggerHeaderComponent, { storageType: this.storageType })
    const SwaggerExtraRightSection = withStorage(SwaggerExtraRightSectionComponent, {
      storageType: this.storageType,
    })

    UIManager.render({ Component: <SwaggerSideBar swaggerUI={this} />, id: ID_SIDE_BAR })
    UIManager.render({ Component: <SwaggerHeader swaggerUI={this} />, id: ID_HEADER })
    UIManager.render({
      Component: <SwaggerExtraRightSection swaggerUI={this} />,
      id: ID_EXTRA_RIGHT,
    })
    this.injectCss()
  }

  injectCss() {
    const apis: Api[] = []
    this.groupApiList?.forEach((g) => apis.push(...(g?.apiList ?? [])))
    let css = ""
    apis.forEach((a) => (css += " " + a.generateCss()))
    injectReplaceCSS(css)
  }

  hideUINotNeeded() {
    // hide top bar
    if (this.$topBar?.style) {
      this.$topBar.style.display = "none"
    }
    if (this.$informationContainerWrapper?.style) {
      this.$informationContainerWrapper.style.display = "none"
    }
    if (this.$schemaContainer?.style) {
      this.$schemaContainer.style.padding = `10px 0`
    }
    if (this.$models?.style) {
      this.$models.style.display = "none"
    }
  }

  injectCopyToClipboard() {
    injectCopyToClipboard()
  }

  injectCopyToClipboardField() {
    this.groupApiList.forEach((g) => {
      g.apiList.forEach((api) => {
        api.injectCopyToClipboardField()
      })
    })
  }

  trackMouse() {
    const onMouseUpdate = (e: MouseEvent) => {
      this.mouseEvent = e
    }
    document.addEventListener("mousemove", onMouseUpdate, false)
    document.addEventListener("mouseenter", onMouseUpdate, false)
  }

  async login(_email?: string, _password?: string) {
    const email = _email ?? config.cr.username
    const password = _password ?? config.cr.password
    const callLogin = async (data: any) => {
      return new Promise((resolve) => {
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
            if (data?.data?.accessToken?.token) {
              NotificationManager.success({ message: `Login successful [${email}]` })
            } else {
              NotificationManager.error({ message: `Login fail [${JSON.stringify(data)}]` })
            }
            resolve(data)
          })
          .catch((err) => {
            NotificationManager.error({ message: `Login fail [${email}]` })
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
        email,
        password,
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
