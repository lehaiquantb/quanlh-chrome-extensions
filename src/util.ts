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
