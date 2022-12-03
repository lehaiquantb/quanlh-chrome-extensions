import { enableHostClipboardFeature, disableHostClipboardFeature } from "./constants"
import { copyToClipboard, createElementByText, isEmptyString } from "./util"
import { ScriptId, ScriptType } from "./type"
import axios from "axios"
import "./assets/scss/content.scss"

chrome.runtime.onMessage.addListener(function (message: ScriptType, sender, sendResponse) {
  switch (message.id) {
    case ScriptId.DOWNLOAD_PDF:
      downloadPdf()
      break
    case ScriptId.DOWNLOAD_WORD:
      downloadWord()
    // eslint-disable-next-line no-fallthrough
    default:
      break
  }
})

export function downloadPdf() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF()
  const elements = document.getElementsByTagName("img")

  const fileName =
    (document.querySelector('meta[property~="og:title"]') as any)?.content ?? "Exported_file.pdf"

  for (const i in elements) {
    const img = elements[i]
    console.log("add img ", img)
    if (!/^blob:/.test(img.src)) {
      console.log("invalid src")
      continue
    }
    const can = document.createElement("canvas")
    const con = can.getContext("2d")
    can.width = img.width
    can.height = img.height
    con.drawImage(img, 0, 0, img.width, img.height)
    const imgData = can.toDataURL("image/jpeg", 1.0)
    pdf.addImage(imgData, "JPEG", 0, 0)
    pdf.addPage()
  }

  pdf.save(fileName)
}

export function downloadWord() {
  const documentIDPath = document.URL.match(/(document|file)\/d(.*)\//)?.[2] ?? ""

  let parseDocument

  // Make a request for a user with a given ID
  axios
    .get(`https://docs.google.com/document/d${documentIDPath}/mobilebasic`)
    .then(function (response) {
      // handle success
      console.log(response)
      const text = response?.data
      const parser = new DOMParser()
      parseDocument = parser.parseFromString(text, "text/html")
      handleDownloadWord(parseDocument.querySelector(".doc").outerHTML)
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })
    .then(function () {
      // always executed
    })

  // fetch(`https://docs.google.com/document/d${documentIDPath}/mobilebasic`)
  // 	.then((response) => response.text())
  // 	.then((data) => {
  // 		const parser = new DOMParser();
  // 		let parseDocument: Document;
  // 		parseDocument = parser.parseFromString(data ?? '', 'text/html');
  // 		handleDownloadWord(parseDocument.querySelector('.doc').outerHTML);
  // 	});
}

function handleDownloadWord(text: string) {
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>"
  const footer = "</body></html>"

  const sourceHTML = header + text + footer

  const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML)

  const filename = `${
    document.querySelector("title")?.text?.replace(/(.docx|.doc)$/g, "") ?? "Document"
  }.doc`

  const fileDownload = document.createElement("a")
  document.body.appendChild(fileDownload)
  fileDownload.href = source
  fileDownload.download = filename
  fileDownload.click()
  document.body.removeChild(fileDownload)
}

function handleCopyCodeToClipboard() {
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

  const snippets = document.querySelectorAll("pre")
  const listElement: { copyButton: HTMLElement; preElement: HTMLElement }[] = []

  snippets.forEach((snippet) => {
    const parent = snippet.parentNode
    const wrapper = document.createElement("div")

    parent.replaceChild(wrapper, snippet)
    wrapper.appendChild(snippet)

    const buttonCopyElement = createElementByText(buttonCopy)
    listElement.push({
      copyButton: buttonCopyElement,
      preElement: snippet,
    })
    wrapper.firstChild.appendChild(buttonCopyElement)
  })

  listElement.forEach(({ copyButton, preElement }) => {
    const iconSuccess: HTMLElement = copyButton.querySelector(".quanlh-copy-success")
    const iconCopy: HTMLElement = copyButton.querySelector(".quanlh-copy-cp")
    copyButton.addEventListener("click", (event) => {
      const stringInCode = preElement.querySelector("code")?.textContent ?? ""
      const text = stringInCode === "" ? preElement.outerText : stringInCode
      const success = copyToClipboard(text)
      if (success) {
        iconSuccess.classList.remove("quanlh-d-none")
        iconCopy.classList.add("quanlh-d-none")
        setTimeout(() => {
          iconSuccess.classList.add("quanlh-d-none")
          iconCopy.classList.remove("quanlh-d-none")
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

const host = window.location.host

function checkHost(host: string): boolean {
  for (const enableHost of enableHostClipboardFeature) {
    if (!enableHost.test(host)) {
      return false
    }
  }

  for (const disableHost of disableHostClipboardFeature) {
    if (disableHost.test(host)) {
      return false
    }
  }

  return true
}

if (checkHost(host)) {
  handleCopyCodeToClipboard()
}
