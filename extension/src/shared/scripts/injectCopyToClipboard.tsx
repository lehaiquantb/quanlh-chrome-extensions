import { copyToClipboard, createElementByText } from "../helper.common"
import { SwaggerUIX } from "../website/swagger/swagger-ui"

const buttonCopy = `
<div class="quanlh-copy-button quanlh-super-center quanlh-d-none">
    <span class="quanlh-copy-success quanlh-d-none">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check color-fg-success">
            <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
        </svg>
    </span>
    <span class="quanlh-copy-cp" aria-label="Copy">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
            <path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
        </svg>
    </span>
</div>
`

const buttonCopyField = `
<div class="quanlh-copy-field-button quanlh-field-none">
      <span class="quanlh-copy-success quanlh-field-none">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check color-fg-success">
          <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
      </svg>
    </span>
    <span class="quanlh-copy-cp" aria-label="Copy">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
            <path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
        </svg>
    </span>

</div>
`
export const injectCopyToClipboard = (_snippets?: HTMLElement[]) => {
  const snippets = _snippets ?? document.querySelectorAll("pre")
  const listElement: { copyButton: HTMLElement; preElement: HTMLElement }[] = []

  snippets.forEach((snippet) => {
    const parent = snippet.parentNode
    const wrapper = document.createElement("div")

    parent?.replaceChild(wrapper, snippet)
    wrapper.appendChild(snippet)

    const buttonCopyElement = createElementByText(buttonCopy)
    listElement.push({
      copyButton: buttonCopyElement,
      preElement: snippet,
    })
    wrapper?.firstChild?.appendChild(buttonCopyElement)
  })

  listElement.forEach(({ copyButton, preElement }) => {
    const iconSuccess: HTMLElement | null = copyButton.querySelector(".quanlh-copy-success")
    const iconCopy: HTMLElement | null = copyButton.querySelector(".quanlh-copy-cp")
    copyButton.addEventListener("click", (event) => {
      const stringInCode = preElement.querySelector("code")?.textContent ?? ""
      const text = stringInCode === "" ? preElement.outerText : stringInCode
      const success = copyToClipboard(text)
      if (success) {
        iconSuccess?.classList.remove("quanlh-d-none")
        iconCopy?.classList.add("quanlh-d-none")
        setTimeout(() => {
          iconSuccess?.classList.add("quanlh-d-none")
          iconCopy?.classList.remove("quanlh-d-none")
        }, 1000)
      }
    })

    preElement.addEventListener("mouseenter", (event) => {
      copyButton.classList.remove("quanlh-d-none")
    })

    preElement.addEventListener("mouseleave", (event) => {
      copyButton.classList.add("quanlh-d-none")
    })
  })
}

export const injectCopyToClipboardField = (parent: HTMLPreElement, swaggerUI: SwaggerUIX) => {
  const fields = Array.from(parent.querySelectorAll("span"))?.filter(
    (item) => item?.style?.color === "rgb(162, 252, 162)",
  )
  const listElement: { copyButton: HTMLElement; field: HTMLElement; wrapper: HTMLElement }[] = []

  fields.forEach((field) => {
    const wrapper = document.createElement("div")
    wrapper.style.display = "inline-block"
    wrapper.style.position = "relative"
    wrapper.appendChild(createElementByText(field.outerHTML))
    // field.replaceWith(wrapper)
    const buttonCopyElement = createElementByText(buttonCopyField)
    listElement.push({
      copyButton: buttonCopyElement,
      field,
      wrapper,
    })
    // field.appendChild(buttonCopyElement)
    wrapper?.appendChild(buttonCopyElement)
    field.replaceWith(wrapper)
  })

  listElement.forEach(({ copyButton, field, wrapper }) => {
    const iconSuccess: HTMLElement | null = copyButton.querySelector(".quanlh-copy-success")
    const iconCopy: HTMLElement | null = copyButton.querySelector(".quanlh-copy-cp")
    copyButton.addEventListener("click", (event) => {
      const stringInCode = field?.textContent ?? ""
      const text = stringInCode.slice(1, -1)
      const success = copyToClipboard(text)
      if (success) {
        iconSuccess?.classList.remove("quanlh-field-none")
        iconCopy?.classList.add("quanlh-field-none")
        setTimeout(() => {
          iconSuccess?.classList.add("quanlh-field-none")
          iconCopy?.classList.remove("quanlh-field-none")
        }, 1000)
      }
    })

    wrapper.addEventListener("mouseenter", (event) => {
      copyButton.classList.remove("quanlh-field-none")
    })

    wrapper.addEventListener("mouseleave", (event) => {
      // eslint-disable-next-line prefer-const
      let timeoutId: number | undefined
      timeoutId && clearTimeout(timeoutId)
      timeoutId = setTimeout(function () {
        let mouseIsInsideCopy = false
        let mouseIsInsideField = false

        if (swaggerUI.mouseEvent?.clientX && swaggerUI.mouseEvent?.clientY) {
          mouseIsInsideCopy = isMouseInsideElement(
            swaggerUI.mouseEvent?.clientX,
            swaggerUI.mouseEvent?.clientY,
            copyButton,
          )
          mouseIsInsideField = isMouseInsideElement(
            swaggerUI.mouseEvent?.clientX,
            swaggerUI.mouseEvent?.clientY,
            wrapper,
          )
        }
        if (!mouseIsInsideCopy && !mouseIsInsideField) {
          copyButton.classList.add("quanlh-field-none")
        }
      }, 100)
    })
  })
}

function isMouseInsideElement(mouseX: number, mouseY: number, element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom
}
