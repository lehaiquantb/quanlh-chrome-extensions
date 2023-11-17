console.log("ads")
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
export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div")
  div.innerHTML = htmlString.trim()

  return div.firstChild as HTMLElement
}

export class GroupApi {
  name: string
  $el: HTMLSpanElement
  apiList: Api[] = []
  constructor(opts: { $el: HTMLSpanElement }) {
    console.log("GroupApi")
    this.$el = opts.$el
    this.name = this.$el?.querySelector("h3")?.getAttribute("data-tag") ?? ""
    this.apiList = Array.from(
      this.$el.querySelector("div.operation-tag-content")?.childNodes as any,
    )?.map(($el: any) => new Api({ $el }))
  }
}

export class Api {
  description: string
  path: string
  method: string
  href: string
  $el: HTMLSpanElement
  $btnExpand: HTMLButtonElement

  constructor(opts: { $el: HTMLSpanElement }) {
    console.log("Api")
    this.$el = opts.$el
    this.method = this.$el?.querySelector(".opblock-summary-method")?.textContent ?? ""
    this.path = this.$el?.querySelector(".opblock-summary-path")?.getAttribute("data-path") ?? ""
    this.description = this.$el?.querySelector(".opblock-summary-description")?.textContent ?? ""
    this.href = this.$el?.querySelector(".opblock-summary-path a")?.getAttribute("href") ?? ""
    this.$btnExpand = this.$el.querySelector("button.opblock-control-arrow") as any
  }
}

export class SwaggerUI {
  groupApiList: GroupApi[] = []
  $sideBar: HTMLDivElement = createElementFromHTML(`<div class="side-bar"></div>`) as HTMLDivElement

  get $informationContainerWrapper(): HTMLDivElement {
    return document.querySelector(".information-container.wrapper") as HTMLDivElement
  }

  get $wrapper(): HTMLDivElement {
    return this.$sectionWrapper.parentElement as HTMLDivElement
  }

  get $sectionWrapper(): HTMLDivElement {
    return document.querySelector("div.wrapper > section.block.block-desktop") as HTMLDivElement
  }

  constructor() {
    // debugger;

    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        this.onPageLoaded()
      }, 500)
    })
  }

  onPageLoaded() {
    console.log("onPageLoaded")
    this.hideUINotNeeded()
    console.log(this.$sectionWrapper)
    const els = Array.from(this.$sectionWrapper?.firstChild?.childNodes as any)
    els?.forEach(($el: any) => {
      this.groupApiList.push(new GroupApi({ $el }))
    })
    this.changeLayout()
  }

  changeLayout() {
    this.$wrapper.prepend(this.$sideBar)
    this.$wrapper.style.display = "flex"
    this.$wrapper.style.flexDirection = "row"
    this.$sideBar.style.width = `70rem`
    this.$sectionWrapper.style.width = `100rem`
  }

  hideUINotNeeded() {
    this.$informationContainerWrapper.style.display = "none"
  }
}

const swaggerUI = new SwaggerUI()
